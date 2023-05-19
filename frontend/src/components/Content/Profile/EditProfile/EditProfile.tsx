import { Button, Dropdown, Form } from "react-bootstrap";
import { BsGearFill } from "react-icons/bs";
import { Modal } from "react-bootstrap";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import JSCookies from 'js-cookie';
import TwoFactorAuthSwitch from "./twofactor";

const EditProfile = (props: any) => {
	const [newUsername, setNewUsername] = useState(''); // state for the new username
    const [showUsernameModal, setShowUsernameModal] = useState(false); // state for showing the username modal
	const  fileRef: any = useRef();
	const [curFile, setCurFile] = useState<string | Blob>();
	const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);

	const handleFileChange = useCallback(async (e: any) => {
		const file = e.target.files[0];

		if (file && file.type.startsWith('image/')) {
			setCurFile(file);
		  } else {
			alert('please select an image file.');
		  }
	}, [setCurFile])

	useEffect(() => {
		if (!curFile)
			return ;

		const formData =  new FormData();
		formData.append('file', curFile);

		axios.put(`http://${process.env.REACT_APP_IP_BACKEND}:6969/aws/upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			}
		})
		.then(response => {

			props.setPicUrl(response.data.url);
		})
		.catch(error => {
		})

	}, [curFile, props])

	const triggerFileInput = useCallback(() => {
		if (fileRef.current)
			fileRef.current.click();
	}, [fileRef])

    const changeUsername = useCallback(() => {
		if (!newUsername || (newUsername.indexOf(' ') > -1) || newUsername.length > 12) {
			alert('No input or have spaces in username or username to long');
			setNewUsername('');
			setShowUsernameModal(false);
			return ;
		}
        axios.put(`http://${process.env.REACT_APP_IP_BACKEND}:6969/users/update/username`, {
            username: newUsername
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
            }
        }).then((response) => {
			props.setUsername(response.data);
            setShowUsernameModal(false); // close the modal after the request is complete
            setNewUsername(''); // reset the new username
			props.setUser({...props.user, username: response.data})
        })
		.catch(err => {
			alert('username already taken');
		})
    }, [newUsername, setNewUsername, setShowUsernameModal, props]);

	const handleTwoFactorAuthClick = useCallback(() => {
		setShowTwoFactorAuth(!showTwoFactorAuth);
	}, [showTwoFactorAuth]);

    return (
        <div>
            <input type='file' style={{display: 'none'}} ref={fileRef} onChange={handleFileChange} />

            <Dropdown>
                <Dropdown.Toggle variant="custom" id="dropdown-basic">
                    Edit Profile<BsGearFill/>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={triggerFileInput}>Change pic</Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowUsernameModal(true)}>Change username</Dropdown.Item>
                    <Dropdown.Item onClick={handleTwoFactorAuthClick}>Two-Factor Authentication </Dropdown.Item>
                </Dropdown.Menu>

                <Modal show={showUsernameModal} onHide={() => setShowUsernameModal(false)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>Change Username</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>New Username:</Form.Label>
                            <Form.Control type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUsernameModal(false)}>Close</Button>
                        <Button variant="primary" onClick={changeUsername}>Change</Button>
                    </Modal.Footer>
                </Modal>
				{showTwoFactorAuth && (
				<TwoFactorAuthSwitch showModal={showTwoFactorAuth} onClose={handleTwoFactorAuthClick} user={props.user} setUser={props.setUser}/>
				)}
				</Dropdown>
        </div>
    );
}

export default EditProfile;