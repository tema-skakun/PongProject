import { Dropdown, Modal } from "react-bootstrap";
import { BsGearFill } from "react-icons/bs";
import InviteButton from "../invitebutton/invitebutton";
import { useState } from "react";
import { channel } from "diagnostics_channel";
import Changepassword from "../changepassword/changepassword";


const ConversationDropdown = (props: any) => {
	const [modalOpen, setModalOpen] = useState(false)
	const [passModal, setPassModal] = useState(false)

	function Leave() {
		const channel = {
			channelId: props.channel.id,
		}
		props.socket.emit('leaveChannel', channel, (callback: any) =>{
			if (callback)
				alert(callback);
		});
	}

	function closeModal() {
		setModalOpen(modalOpen ? false : true)
	}

	function closePass() {
		setPassModal(passModal ? false : true)
	}

	return (
		<Dropdown>
		<Dropdown.Toggle variant="custom" id="dropdown-basic">
			<BsGearFill/>
		</Dropdown.Toggle>

		<Dropdown.Menu>
			<Dropdown.Item onClick={Leave}>Leave</Dropdown.Item>
			<Dropdown.Item onClick={closeModal}>Invite</Dropdown.Item>
			<Dropdown.Item onClick={closePass}>Change password</Dropdown.Item>
		</Dropdown.Menu>
		<Modal show={modalOpen} onHide={closeModal} backdrop="static" keyboard={false}>
			<InviteButton socket={props.socket.current} closeModal={closeModal} channel={props.channel}/>
		</Modal>
		<Modal show={passModal} onHide={closePass} backdrop="static" keyboard={false}>
			<Changepassword socket={props.socket.current} closePass={closePass} channel={props.channel}/>
		</Modal>
		</Dropdown>
  	);
};

export default ConversationDropdown;