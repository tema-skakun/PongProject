import { Dropdown } from "react-bootstrap";
import { BsGearFill } from "react-icons/bs";


const ConversationDropdown = (props: any) => {

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

	return (
		<Dropdown>
		<Dropdown.Toggle variant="custom" id="dropdown-basic">
			<BsGearFill/>
		</Dropdown.Toggle>

		<Dropdown.Menu>
			<Dropdown.Item onClick={Leave}>Leave</Dropdown.Item>
			<Dropdown.Item onClick={BlockUser}>Block</Dropdown.Item>
			<Dropdown.Item onClick={unblockUser}>Unblock</Dropdown.Item>
			<Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
		</Dropdown.Menu>
		</Dropdown>
  	);
};

export default ConversationDropdown;