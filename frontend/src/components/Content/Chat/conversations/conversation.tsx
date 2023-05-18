import axios from 'axios';
import { useEffect, useState } from 'react';
import './conversation.css'
import ConversationDropdown from './dropdown/dropdown';
import JSCookies from 'js-cookie';
import { Modal } from 'react-bootstrap';
import InviteButton from './invitebutton/invitebutton';

export default function Conversation(props: any) {
	const [user, setUser] = useState<any>(null);

	useEffect(() => {
		const getUser = async () => {
			if (props.channel.isDM) {
				try {
					const res = await axios(`http://${process.env.REACT_APP_IP_BACKEND}:6969/chat/channelUsers/` + props.channel.id, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
						}
					});
					const friend = res.data.find((m: any) => m.intra_id !== props.currentUser.intra_id);
					setUser(friend);
				}catch(err) {
				}
			}
		};
		getUser();
	}, [props.channel, props.currentUser])


	return (
		<div className={props.channel?.id === props.currentChannel?.id ? 'active' : 'conversation' }>
			<img className='conversationImg' 
			src={
				user?.picture_url
					? user.picture_url
					: 'https://msf-theeltal.de/wp-content/uploads/2018/04/no-avatar.jpg'
			} 
			alt=''
			/>
			<span className='conversationName'>{user?.username ? user.username : props.channel.name}</span>
			<div>
				<ConversationDropdown currentUser={props.currentUser} channel={props.channel} socket={props.socket}/>
			</div>
		</div>
	)
}