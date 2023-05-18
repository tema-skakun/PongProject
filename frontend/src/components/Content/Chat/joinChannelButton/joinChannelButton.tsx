import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import JSCookies from 'js-cookie';

const JoinChannelButton = ({ closeModal, socket }: {closeModal: any, socket: any}) => {
	const [channels, setChannels] = useState<any>([]);
	const [selectedChannelId, setSelectedChannelId] = useState<string>('');

	useEffect(() =>{
		const getChannels = async ()=>{
			try {
				const res = await axios.get(`http://${process.env.REACT_APP_IP_BACKEND}:6969/chat/channelsCanJoin`, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
					}
				})
				setChannels(res.data);
			} catch(err) {
			}
		}
		getChannels();
	}, [])

	async function handleSubmit(e: any) {
		e.preventDefault();
		if (selectedChannelId) {
			const selectedChannel = channels.find((channel: any) => channel.id === selectedChannelId);
			let password;
			if (selectedChannel.password) {
				password = prompt('Enter channel password: ');
			}
			const chann = {
				channelId: selectedChannelId,
				password: password ? password : null,
			}
			socket.emit('joinChannel', chann, (callback: any) => {
				if (callback) {
					alert(callback);
					return ;
				}
			})
			closeModal();
		}
	}

	function handleCheckboxChange(channelId: any) {
		setSelectedChannelId(channelId);
	}

	return (
		<>
			<Modal.Header closeButton><Modal.Title>Join channel</Modal.Title></Modal.Header>
			<Modal.Body>
				<Form onSubmit={handleSubmit}>
				{channels.map((channel: any) => (
					<Form.Group key={channel.id} controlId={channel.id}>
					<Form.Check
						type="radio"
						name="channel"
						id={channel.id}
						value={channel.id}
						label={channel.name}
						checked={channel.id === selectedChannelId}
						onChange={() => handleCheckboxChange(channel.id)}
					/>
					</Form.Group>
				))}
				<Modal.Footer> <Button type="submit">Join</Button> </Modal.Footer>
				</Form>
			</Modal.Body>
		</>
	);
};

export default JoinChannelButton;