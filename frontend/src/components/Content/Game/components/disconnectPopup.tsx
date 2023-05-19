import { useCallback, useState } from "react";
import Popup from "reactjs-popup";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { socket } from "../../../../App";

export type DisconnectPopupArgs = {
	showDisconnect: boolean;
	setShowDisconnect: (val: boolean) => any;
	// socket: Socket<any, any> | null;
};


export const DisconnectPopup: React.FC<DisconnectPopupArgs> = ({showDisconnect, setShowDisconnect}) => {

	const deactivatePopup = useCallback(() => {
		setShowDisconnect(false);
	}, [setShowDisconnect])

	// const retry = useCallback(() => {
	// 	if (socket) {
	// 		socket.connect();
	// 	} else {
	// 		socket = io(`http://${process.env.REACT_APP_IP_BACKEND}:6969/game`, {
	// 			withCredentials: true,
	// 			path: '/gameListener'
	// 		});
	// 	}
	// }, [])

	return (<Popup open={showDisconnect} onClose={deactivatePopup} >
				<p>The connection to server has been lost.</p>
				<p>All games have been canceled.</p>
				{/* <button onClick={retry}>try to reconnect</button> */}
			</Popup>)
}

