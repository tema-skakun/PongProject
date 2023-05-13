import React, { useState, useCallback } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { BsGearFill } from "react-icons/bs";
import './Dropdown.css';
import axios from "axios";
import JSCookies from 'js-cookie';

const ParticipantsDropdown = (props: any) => {

	function sendPm() {
		const channel = {
			receiverId: props.userProfile.intra_id,
		}
		props.socket.emit('createDM', channel, (callback: any) =>{
			if (callback)
				alert(callback);
		});
	}

	function BlockUser() {
		const info = {
			receiverId: props.userProfile.intra_id,
		}
		props.socket.emit('blockUser', info, (callback: any) => {
			if (callback)
				alert(callback);
		})
	}

	function unblockUser() {
		const info = {
			receiverId: props.userProfile.intra_id,
		}
		props.socket.emit('unblockUser', info, (callback: any) => {
			if (callback)
				alert(callback);
		})
	}

	async function addAsFriend() {
		try {
			const res = await axios.post(`http://${process.env.REACT_APP_IP_BACKEND}:6969/friends/` + props.userProfile.intra_id, {}, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
				}
			})
		}catch(err) {
			console.log('ERROR in add friend: ' + err);
		}
	}

	function pongInvite() {
		
	}

	async function makeAdministrator() {
		try {
			const chan = {
				userId: props.userProfile.intra_id,
				channelId: props.channel.id,
			}
			const res = await axios.post(`http://${process.env.REACT_APP_IP_BACKEND}:6969/chat/makeAdmin`, chan, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
				}
			})
			alert(res.data.message);
		}catch(err: any) {
			alert(err.response.data.error);
		}
	}

	function kickUser() {
		
	}

	function banUser() {
		
	}

	function muteUser() {
		
	}

	return (
		<Dropdown>
		<Dropdown.Toggle variant="custom" id="dropdown-basic">
			<BsGearFill/>
		</Dropdown.Toggle>

		<Dropdown.Menu>
			<Dropdown.Item onClick={sendPm}>Send DM</Dropdown.Item>
			<Dropdown.Item onClick={BlockUser}>Block</Dropdown.Item>
			<Dropdown.Item onClick={unblockUser}>Unblock</Dropdown.Item>
			<Dropdown.Item onClick={addAsFriend}>Add to friends</Dropdown.Item>
			<Dropdown.Item onClick={pongInvite}>Pong invite</Dropdown.Item>
			<Dropdown.Item onClick={makeAdministrator}>Make as Admin</Dropdown.Item>
			<Dropdown.Item onClick={kickUser}>Kick</Dropdown.Item>
			<Dropdown.Item onClick={banUser}>Ban</Dropdown.Item>
			<Dropdown.Item onClick={muteUser}>Mute</Dropdown.Item>
		</Dropdown.Menu>
		</Dropdown>
  	);
};

export default ParticipantsDropdown;
