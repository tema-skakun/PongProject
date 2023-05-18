import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import JSCookies from 'js-cookie';
import axios from 'axios';

function TwoFactorAuthSwitch(props: any) {
	const [picture, setPicture] = useState('');
	const [code, setCode] = useState('');

	async function handleActivate() {
		try {
			const info = {
				twoFactorAuthenticationCode: code,
			}
			const res = await axios.post(`http://${process.env.REACT_APP_IP_BACKEND}:6969/2fa/turn-on`, info, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
				}
			})
			const newToken = await res.data;
			JSCookies.set('accessToken', newToken);
			props.onClose();
			props.user.isTwoFactorAuthenticationEnabled = true;
		}catch(err: any) {
			props.onClose();
			alert(err.response.data.message);
		}
	}

	async function handleDeactivate() {
		try {
			const res = await axios.post(`http://${process.env.REACT_APP_IP_BACKEND}:6969/2fa/turn-off`, {}, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
				}
			})
			props.onClose();
			props.user.isTwoFactorAuthenticationEnabled = false;
		}catch(err: any) {
			props.onClose();
			alert(err.response.data.message);
		}
	}

	useEffect(() => {
		const generateQRCode = async () => {
			if (!props.user.isTwoFactorAuthenticationEnabled) {
				const url = `http://${process.env.REACT_APP_IP_BACKEND}:6969/2fa/generate`; 
				const headers = {
					Accept: 'image/png',
					'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
				};
				try {
					const response = await fetch(url, {
						method: 'POST', 
						headers: headers,
					});
				if (response.ok) {
					const qrCodeBuffer = await response.arrayBuffer();
					const qrCodeBlob = new Blob([qrCodeBuffer], { type: 'image/png' }); 
					const qrCodeImageUrl = URL.createObjectURL(qrCodeBlob);
					setPicture(qrCodeImageUrl);
				} else {
					console.error('Error generating QR code:', response.status, response.statusText);
				} 
				} catch (error) {
					console.error('Error generating QR code:', error);
				}
			}
		};
		generateQRCode();

  }, []);

  return (
    <Modal show={props.showModal} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Two-Factor Authentication</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.user.isTwoFactorAuthenticationEnabled ? (
          <Form.Group>
            <Form.Label>Deactivate Two-Factor Authentication</Form.Label>
            <Button variant="danger" onClick={handleDeactivate}>
              Deactivate
            </Button>
          </Form.Group>
        ) : (
          <>
            <Form.Group>
              <Form.Label>Scan qrcode with google authenticator</Form.Label>
              <img src={picture} alt="QR Code" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Code:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          Close
        </Button>
        {!props.user.isTwoFactorAuthenticationEnabled && (
          <Button variant="primary" onClick={handleActivate}>
            Activate
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default TwoFactorAuthSwitch;