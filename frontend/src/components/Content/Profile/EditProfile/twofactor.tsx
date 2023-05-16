import { useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import JSCookies from 'js-cookie';

function TwoFactorAuthSwitch(props: any) {
  const [bool, setBool] = useState(false);
  const [picture, setPicture] = useState('');
  const [code, setCode] = useState('');

console.log("bool: " + props.user.isTwoFactorAuthenticationEnabled);
  const handleActivate = useCallback(() => {
	console.log('code: ' + code);
    if (code) {
		const url = 'http://localhost:6969/2fa/turn-on'; // replace with your API endpoint URL
		const headers = {
			'Content-Type': 'application/json', // set the appropriate Content-Type header
			'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
		};
		const body = JSON.stringify({
			twoFactorAuthenticationCode: code,
		});
		fetch(url, {
			method: 'POST', // set the appropriate HTTP method
			headers: headers,
			body: body,
		})
		.then(response => {
		if (response.ok) {
			// handle success response
			console.log('response ok: ' + response);
		} else {
			alert('wrong code');
		}
		})
	}
  }, [code]);

  const handleDeactivate = useCallback(() => {
    // Add your deactivation logic here
    // For now, it will toggle the bool state and display an alert
    setBool((prevBool) => !prevBool);
    alert('Deactivate button clicked!');
  }, []);

  useEffect(() => {
	const generateQRCode = async () => {
		if (!props.user.isTwoFactorAuthenticationEnabled) {
			const url = 'http://localhost:6969/2fa/generate'; // replace with your API endpoint URL
			const headers = {
				Accept: 'image/png',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			};
			try {
				const response = await fetch(url, {
					method: 'POST', // set the appropriate HTTP method
					headers: headers,
				});
			if (response.ok) {
				const qrCodeBuffer = await response.arrayBuffer();
				const qrCodeBlob = new Blob([qrCodeBuffer], { type: 'image/png' }); // Update with the appropriate MIME type
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

  }, [props.user.isTwoFactorAuthenticationEnabled]);

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