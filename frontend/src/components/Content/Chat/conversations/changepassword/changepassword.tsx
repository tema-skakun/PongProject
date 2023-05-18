import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import JSCookies from 'js-cookie';
 

export default function Changepassword({ closePass, socket, channel }: {closePass: any, socket: any, channel: any}) {
	const [newPassword, setNewPassword] = useState<string>("");

	async function handleSubmit(e: any) {
		e.preventDefault();
		const info = {
			password: newPassword,
		}
		try {
			const res = await axios.post(`http://${process.env.REACT_APP_IP_BACKEND}:6969/chat/changePassword/` + channel.id, info, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
				},
			})
		} catch(err: any) {
			alert(err.response.data.error)
		}
		closePass();
	}


	return (
		<>
		<Modal.Header closeButton><Modal.Title>Write a new password or leave it empty</Modal.Title></Modal.Header>
		<Modal.Body>
			<Form onSubmit={handleSubmit}>
			<Form.Group>
				<Form.Label>New Password</Form.Label>
				<Form.Control type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
				</Form.Group>
			<Modal.Footer> <Button type="submit">Change</Button> </Modal.Footer>
			</Form>
		</Modal.Body>
		</>
	);
}