import { useEffect, useRef, useState } from "react";
import './Chat.css'
import Conversation from './conversations/conversation';
import Message from './Message/Message';
import Participants from './participants/participants';
import axios from 'axios';
import { io } from 'socket.io-client'
import JSCookies from 'js-cookie';
import CreateChannelButton from './createConversationButton/createConversationButton';
import JoinChannelButton from './joinChannelButton/joinChannelButton';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';


const CREATE_KEY = 'create'
const JOIN_KEY = 'join'

const Chat = (props: any) => {
	const [channels, setChannels] = useState<any>([]);
	const [currentChannel, setCurrentChannel] = useState<any>(null);
	const [messages, setMessages] = useState<any>([]);
	const [newMessage, setNewMessage] = useState('');
	const scrollRef = useRef<any>();
	const socket = useRef<any>();
	const [arrivalMessage, setArrivalMessage] = useState<any>(null);
	const [modalOpen, setModalOpen] = useState(false)
	const [activeKey, setActiveKey] = useState(CREATE_KEY)

	useEffect(() => {
		socket.current = io(`ws://${process.env.REACT_APP_IP_BACKEND}:6969/chat`, {
			query: { accessToken:  JSCookies.get('accessToken')},
		  });
		socket.current.on('getMessage', (data: any) => {
			setArrivalMessage(data);
		});
		return (() => {
				socket.current.disconnect();
		})
	}, []);

	useEffect(() => {
		if (arrivalMessage && currentChannel && currentChannel.id === arrivalMessage.channel.id) {
			setMessages((prev: any)=> [...prev, arrivalMessage]);
		}
		setArrivalMessage(null);
	}, [arrivalMessage])


	useEffect(() =>{
		const getChannels = async (channelId: number)=>{
			try {
				const res = await axios.get(`http://${process.env.REACT_APP_IP_BACKEND}:6969/chat/chat/`+props.userdata.intra_id, {
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
					}
				})
				if (res.data !== channels)
					setChannels(res.data);
				if (channelId === 0) {
					setCurrentChannel(null)
				}
				else if (channelId) {
					const chann = await res.data.find((channel: any) => channel.id === channelId);
					setCurrentChannel(chann);
				}
			} catch(err) {
			}
		}
		getChannels(0);
		socket.current.on('updateChannels', async (channelId: any) => {
			getChannels(channelId);
		})
	}, [props.userdata.intra_id])

	useEffect(() =>{
		if (currentChannel) {
			const getMessages =async () => {
				try {
					const res = await axios.get(`http://${process.env.REACT_APP_IP_BACKEND}:6969/messages/channel/`+currentChannel?.id, {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
						}
					});
					if (res.data !== messages)
						setMessages(res.data);
				} catch(err) {
				}
			}
			getMessages();
		}
	},[currentChannel]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (!newMessage)
			return ;
		const message = {
			text: newMessage,
			channelId: currentChannel.id,
		};

		socket.current.emit('sendMessage', message, (callback: any) => {
			if (callback) {
				alert(callback);
				return ;
			}
		});
		setNewMessage('');
	}

	useEffect(()=>{
		scrollRef.current?.scrollIntoView({behavior: "smooth" });
	},[messages])

	function closeModal() {
		setModalOpen(false)
	}

    return (
        <div className="chat">
            <div className='chatMenu'>
				<div className="chatMenuWrapper">
					<div className='chatMenuButtons' style={{ display: 'flex', justifyContent: 'space-between' }} >
						<Button onClick={() => {setActiveKey(CREATE_KEY); setModalOpen(true) } } className="rounded-0" style={{ flex: 1 }}>
							Create
						</Button>
						<Button onClick={() => {setActiveKey(JOIN_KEY); setModalOpen(true) } } className="rounded-0" style={{ flex: 1, marginLeft: '3px' }}>
							Join
						</Button>
					</div>
						{channels.map((c: any) => (
							<div key={c.id} onClick={() => setCurrentChannel(c)}>
								<Conversation currentChannel={currentChannel}
											  channel={c}
											  currentUser={props.userdata}
											  socket={socket.current}
								/>
							</div>
						))}
				</div>
			</div>
			<div className='chatBox'>
				<div className="chatBoxWrapper">
					{currentChannel ? (
						<>
							<div className="chatBoxTop">
								{messages.map((m: any)=>(
									<div key={m.id} ref={scrollRef}>
										<Message message={m} own={m.sender.intra_id === props.userdata.intra_id} />
									</div>
								))}
							</div>
							<div className="chatBoxBottom">
								<textarea className="chatMessageInput" 
									placeholder='write something...'
									onChange={(e) => setNewMessage(e.target.value)}
									value={newMessage}
								></textarea>
								<button className='chatSubmitButton' onClick={handleSubmit}>Send</button>
							</div>
						</> 
					) : (
						<span className='noConversationText'>Open a conversation</span>
					)}
				</div>
			</div>
			<div className="chatParticipants">
				<div className="chatParticipantsWrapper">
					<Participants channel={currentChannel} currentUser={props.userdata} socket={socket.current}/>
				</div>
			</div>
			<Modal show={modalOpen} onHide={closeModal} backdrop="static" keyboard={false}>
				{activeKey === CREATE_KEY ?
					<CreateChannelButton socket={socket.current} closeModal={closeModal} /> :
					<JoinChannelButton socket={socket.current} closeModal={closeModal} />
				}
      		</Modal>
        </div>
    )
}

export default Chat;