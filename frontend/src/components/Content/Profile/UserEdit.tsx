import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import JSCookies from 'js-cookie';
import { Dropdown } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { BsGearFill } from 'react-icons/bs';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

const EditProfile = (props: any) => {

const  fileRef: any = useRef();
const [curFile, setCurFile] = useState<string>();
const [newUsername, setNewUsername] = useState(''); // state for the new username
const [showUsernameModal, setShowUsernameModal] = useState(false); // state for showing the username modal

const handleFileChange = (event: any) => {
	const file = event.target.files[0];
  
	if (file && file.type.startsWith('image/')) {
	  const reader = new FileReader();
  
	  reader.onloadend = () => {
		reader.onload = () => {
			const img = new Image();
			img.src = reader.result as string;
			img.onload = () => {
			  const canvas = document.createElement('canvas');
			  const MAX_WIDTH = 240; // specify the desired maximum width
			  const MAX_HEIGHT = 240; // specify the desired maximum height
			  let width = img.width;
			  let height = img.height;
	  
			  // calculate new width and height while maintaining the aspect ratio
			  if (width > MAX_WIDTH) {
				height *= MAX_WIDTH / width;
				width = MAX_WIDTH;
			  }
			  if (height > MAX_HEIGHT) {
				width *= MAX_HEIGHT / height;
				height = MAX_HEIGHT;
			  }
	  
			  canvas.width = width;
			  canvas.height = height;
			  const ctx = canvas.getContext('2d');
			  ctx?.drawImage(img, 0, 0, width, height);
			  const optimizedImageDataUrl = canvas.toDataURL(file.type);
			  setCurFile(optimizedImageDataUrl);
			};
		  };
	  };
  
	  reader.readAsDataURL(file);
	} else {
	}
  };

  const triggerFileInput = useCallback(() => {
	if (!fileRef.current)
		return ;
	
	fileRef.current.click();
  }, [])

useEffect(() => {
	if (!curFile)
		return ;

	axios.put(`http://${process.env.REACT_APP_IP_BACKEND}:6969/users/update/pic`, {
		profilePic: curFile
	}, {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
		}
	})
}, [curFile])

const changeUsername = useCallback(() => {
	axios.put(`http://${process.env.REACT_APP_IP_BACKEND}:6969/users/update/username`, {
		username: newUsername
	}, {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
		}
	}).then(() => {
		setShowUsernameModal(false); // close the modal after the request is complete
		setNewUsername(''); // reset the new username
	})
}, [newUsername, setNewUsername, setShowUsernameModal]);

// ...

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
				<Dropdown.Item onClick={(e) => {e.stopPropagation()} }>
					<Form.Check 
						type="switch"
						id="custom-switch"
						label="Toggle label"
						onChange={() => {}}
					/>
				</Dropdown.Item>
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
		</Dropdown>
	</div>
);
}