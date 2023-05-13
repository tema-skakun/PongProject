import Popup from "reactjs-popup";
import { useCallback } from "react";
import { Socket } from "socket.io-client";
import { useState, useRef } from "react";

type InvitePopUpArgs = {
	// invitedBy: [string, (res: string) => void];
	socket: Socket<any, any> | null;
};

export const InvitePopUp: React.FC<InvitePopUpArgs> = ({socket}) => {
	
	const [displayPopUp, setDisplayPopUp] = useState<boolean>(false);
	const InviterRef: React.MutableRefObject<{inviter: string, callback: (res: string) => void}> = useRef<{inviter: string, callback: (res: string) => void}>({inviter: 'no inviter', callback: (res: string) => console.log('no callback specified') });
	
	if (socket)
	{
		socket.on('inviteReq', (inviter: string, callback: (res: string) => void) => {
			InviterRef.current.inviter = inviter;
			InviterRef.current.callback = callback;
			setDisplayPopUp(true);
		})
	}

	const acceptInvitation = useCallback(() => {
		InviterRef.current.callback('I will destory you'); // This message will kick off the handshake
		setDisplayPopUp(false);
	}, [InviterRef, setDisplayPopUp]);

	const rejectInvitation = useCallback(() => {
		InviterRef.current.callback('Fuck off');
		setDisplayPopUp(false);
	}, [InviterRef, setDisplayPopUp]);

	return (
	< Popup open={displayPopUp} position='right center' onClose={ () => setDisplayPopUp(false)}>
		<div>
			<p>invitedBy: {InviterRef.current.inviter}</p>
			<button onClick={acceptInvitation}>feelin' lucky</button>
			<button onClick={rejectInvitation}>I don't fuck with you</button>
		</div>
	</Popup>)
}