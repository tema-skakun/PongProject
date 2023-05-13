import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import JSCookies from 'js-cookie';
 

export default function InviteButton({ closeModal, socket }: {closeModal: any, socket: any}) {
	const [selectedContactIds, setSelectedContactIds] = useState<any>([]);
	const [users, setUsers] = useState<any>([]);

	// useEffect(() =>{
	// 	const getUsers = async ()=>{
	// 		try {
	// 			const res = await axios.get(`http://${process.env.REACT_APP_IP_BACKEND}:6969/users/notBlockedUsers`, {
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 					'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
	// 				}
	// 			})
	// 			setUsers(res.data);
	// 		} catch(err) {
	// 			console.log(err);
	// 		}
	// 	}
	// 	getUsers();
	// }, [])

	async function handleSubmit(e: any) {
		e.preventDefault();
		// if () {
		// 	alert('Please fill out all fields');
		// 	return;
		// }
		// const invite = {
		// 	usersId: selectedContactIds,
		// }
		// socket.emit('inviteToChannel', invite, (callback: any) => {
		// 	if (callback) {
		// 		alert(callback);
		// 		return;
		// 	}
		// });
		setSelectedContactIds([]);
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


	return (
		<>
		<Modal.Header closeButton><Modal.Title>Choose users</Modal.Title></Modal.Header>
		<Modal.Body>
			<Form onSubmit={handleSubmit}>
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