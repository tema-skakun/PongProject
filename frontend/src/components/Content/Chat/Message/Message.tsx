import './message.css'
import TimeAgo from 'react-timeago'

export default function Message({ message, own }: { own: boolean, message:any }) {

	return (
		<div className={own ? 'message own' : 'message' }>
			<div className="messageTop">
				<img
					className='messageImg'
					src={message.sender.picture_url}
					alt=''
				/>
				<p className='messageText'>
					{message.text}
				</p>
			</div>
			<div className="messageBottom"><TimeAgo date={message.createdAt} /></div>

		</div>
	)
}
