import { useCallback, useEffect, useState } from 'react'
import './participants.css'
import axios from 'axios';
import { Button, Dropdown } from 'react-bootstrap';
import { BsGearFill } from 'react-icons/bs';
import ParticipantsDropdown from './Dropdown/Dropdown';
import JSCookies from 'js-cookie';
import { NavLink, Route } from 'react-router-dom';

export default function Participants({ channel, currentUser, socket}: {channel: any, currentUser: any, socket: any}) {
	const[members, setMembers] = useState<any>([])

	useEffect(() => {
			const getChannelUsers = async () => {
				if (channel) {
					try {
						const res = await axios.get(`http://${process.env.REACT_APP_IP_BACKEND}:6969/chat/channelUsers/` + channel.id, {
							headers: {
								'Content-Type': 'application/json',
								'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
							}
						});
						const friend = res.data.find((m: any) => m.intra_id === currentUser.intra_id);
						const friends = res.data.filter((obj: any) => obj.intra_id !== friend.intra_id);
						setMembers(friends);
					}catch(err) {
					}
				}
				else {
					setMembers([])
				}
			};
			getChannelUsers();
			socket?.on('updateMembers', (data: any) =>{
				getChannelUsers();
			});
		
	}, [channel, currentUser])


	return (
		<div className='chatParticipants' >
			{members.map((o: any) => (
				<div key={o.intra_id} className='chatOnlineParticipants'>
					<div className="chatParticipantsImgContainer">
						<img
							className="chatParticipantsImg" 
							src={o.picture_url} 
							alt=''
						/>
					</div>
					<NavLink to={`/profile/${o.intra_id}`}>
						<span className='chatParticipantsName'>{o.username}</span>
					</NavLink>
					<div>
						< ParticipantsDropdown userProfile={o} currentUser={currentUser} socket={socket} channel={channel}/>
					</div>
				</div>
			))}
		</div>
	
	)
}
  