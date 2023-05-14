import { useCallback, useState } from "react";
import Popup from "reactjs-popup";
import { Socket } from "socket.io-client";

export type RejectionPopupArgs = {
	showRejection: boolean;
	setShowRejection: (val: boolean) => any;
	socket: Socket<any, any> | null;
};


export const RejectionPopup: React.FC<RejectionPopupArgs> = ({socket, showRejection, setShowRejection}) => {

	const deactivateRejection = useCallback(() => {
		setShowRejection(false);
	}, [setShowRejection])

	return (<Popup open={showRejection} onClose={deactivateRejection} >
				<p>Other player has politely told you to fuck off.</p>
				<button onClick={deactivateRejection}>Got you braf</button>
			</Popup>)
}
