import { Dropdown, Modal } from "react-bootstrap";
import { BsGearFill } from "react-icons/bs";
import InviteButton from "../invitebutton/invitebutton";
import { useState } from "react";


const ConversationDropdown = (props: any) => {
	const [modalOpen, setModalOpen] = useState(false)

	function Leave() {
		const channel = {
			channelId: props.channel.id,
		}
		props.socket.emit('leaveChannel', channel, (callback: any) =>{
			if (callback)
				alert(callback);
		});
	}

	function BlockUser() {

	}

	function unblockUser() {

	}

	function closeModal() {
		setModalOpen(modalOpen ? false : true)
	}

	return (
		<Dropdown>
		<Dropdown.Toggle variant="custom" id="dropdown-basic">
			<BsGearFill/>
		</Dropdown.Toggle>

		<Dropdown.Menu>
			<Dropdown.Item onClick={Leave}>Leave</Dropdown.Item>
			<Dropdown.Item onClick={closeModal}>Invite</Dropdown.Item>
		</Dropdown.Menu>
		<Modal show={modalOpen} onHide={closeModal} backdrop="static" keyboard={false}>
			<InviteButton socket={props.socket.current} closeModal={closeModal} />
		</Modal>
		</Dropdown>
  	);
};

export default ConversationDropdown;