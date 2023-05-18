import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import JSCookies from 'js-cookie';
 

export default function CreateChannelButton({ closeModal, socket }: {closeModal: any, socket: any}) {
	const [selectedContactIds, setSelectedContactIds] = useState<any>([]);
	const [channelName, setChannelName] = useState<string>('');
	const [users, setUsers] = useState<any []>([]);
	const [channelType, setChannelType] = useState<string>('');
  	const [channelPassword, setChannelPassword] = useState<string>('');

	useEffect(() =>{
		const getUsers = async ()=>{
			try {
				const res = await axios.get(`http://${process.env.REACT_APP_IP_BACKEND}:6969/users/notBlockedUsers`, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
					}
				})
				setUsers(res.data);
			} catch(err) {
			}
		}
		getUsers();
	}, [])

	async function handleSubmit(e: any) {
		e.preventDefault();
		if (channelName === '' || !selectedContactIds[0] || !channelType || (channelType === 'protected' && channelPassword === '')) {
			alert('Please fill out all fields');
			return;
		}
		if (channelName.length > 10) {
			alert('Channel name shouldnt be longer then 10 char');
			return;
		}
		const newChannel = {
			name: channelName,
			type: channelType,
			password: channelPassword,
			usersId: selectedContactIds,
		}
		socket.emit('createChannel', newChannel, (callback: any) => {
			if (callback) {
				alert(callback);
				return;
			}
		});
		setSelectedContactIds([]);
		setChannelName('');
		setChannelType('');
    	setChannelPassword('');
		closeModal();
	}

	function handleCheckboxChange(contactId: any) {
		setSelectedContactIds((prevSelectedContactIds: any) => {
		if (prevSelectedContactIds.includes(contactId)) {
			return prevSelectedContactIds.filter((prevId: any) => {
				return contactId !== prevId;
			});
		} else {
			return [...prevSelectedContactIds, contactId];
		}
		});
	}

	function handleChannelNameChange(e: any) {
		setChannelName(e.target.value);
	}


	return (
		<>
		<Modal.Header closeButton><Modal.Title>Create channel</Modal.Title></Modal.Header>
		<Modal.Body>
			<Form onSubmit={handleSubmit}>
				<Form.Group controlId="channelName">
					<Form.Label>Channel Name</Form.Label>
					<Form.Control type="text" value={channelName} onChange={handleChannelNameChange} required/>
				</Form.Group>
				<Form.Group >
                    <Form.Label>Channel Type</Form.Label>
                    <div>
                        <Form.Check
                            inline
							id="public"
                            label="Public"
                            type="radio"
                            name="type"
                            value="public"
                            checked={channelType === 'public'}
                            onChange={(e) => setChannelType(e.target.value)}
                        />
                        <Form.Check
                            inline
							id="private"
                            label="Private"
                            type="radio"
                            name="type"
                            value="private"
                            checked={channelType === 'private'}
                            onChange={(e) => setChannelType(e.target.value)}
                        />
                        <Form.Check
                            inline
							id="protected"
                            label="Protected"
                            type="radio"
                            name="type"
                            value="protected"
                            checked={channelType === 'protected'}
                            onChange={(e) => setChannelType(e.target.value)}
                        />
                    </div>
                </Form.Group>
                {channelType === 'protected' && (
                    <Form.Group controlId="channelPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={channelPassword}
                            onChange={(e) => setChannelPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                )}
			{users.map((user: any) => (
				<Form.Group controlId={user.intra_id} key={user.intra_id}>
				<Form.Check
					type="checkbox"
					value={selectedContactIds.includes(user.intra_id)}
					label={user.username}
					onChange={() => handleCheckboxChange(user.intra_id)}
				/>
				</Form.Group>
			))}
			<Modal.Footer> <Button type="submit">Create</Button> </Modal.Footer>
			</Form>
		</Modal.Body>
		</>
	);
}