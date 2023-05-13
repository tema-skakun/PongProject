import { useCallback, useState } from "react";
import Popup from "reactjs-popup";
import { Socket } from "socket.io-client";

export type RejectionPopupArgs = {
	// showRejection: boolean;
	// setShowRejection: (val: boolean) => any;
	socket: Socket<any, any> | null;
};

export type clickHandlerFactory = (inputVal: string, setDisplayBtn: Function, setInputVal: Function) => () => void;
export let inheritedClosureFromPopUp: clickHandlerFactory | null = null; 

export const RejectionPopup: React.FC<RejectionPopupArgs> = ({socket}) => {
	const [showRejection, setShowRejection] = useState<boolean>(false);

	const deactivateRejection = useCallback(() => {
		setShowRejection(false);
	}, [setShowRejection])

	inheritedClosureFromPopUp = useCallback((inputVal: string, setDisplayBtn: Function, setInputVal: Function) => () => {
		if (socket)
			socket.emit('invite', inputVal, (res: string) => {
				if (res === 'Fuck off') // the other player has rejected
				{
					setShowRejection(true); // Finit
				} else if (res === 'I will destory you')
				{
					setDisplayBtn(false);
				}
			});
		setInputVal('');
	}, [socket])
	

	return (<Popup open={showRejection} onClose={deactivateRejection} >
				<p>Other player has politely told you to fuck off.</p>
				<button onClick={deactivateRejection}>Got you braf</button>
			</Popup>)
}
