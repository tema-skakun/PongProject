import { useParams } from "react-router-dom";
import defaultAvatar from "../../../../assets/images/defaultAvatar.png";
import React, { useCallback, useEffect, useState } from "react";
import { socket } from "../../../../App";

type FriendDto = {
    name: string;
    id: number;
    pictureUrl?: string;
    status: string;
};

let Friends = (props: any) => {
	const [status, setStatus] = useState<Map<number, string> >(new Map());
	const {intra_id} = useParams();

	const eventHandler = useCallback((change: any) => {
		console.log(`Getting into the event handler ${change.intra_id} to ${change.newStatus}`);
		const copyMap = status;
		console.log(typeof change.intra_id);
		setStatus(copyMap.set(change.intra_id, change.newStatus));
	}, [setStatus, status])

	useEffect(() => {
		const copyMap = status;
		for (const user of props.users)
		{
			setStatus(copyMap.set(Number(user.id), user.status));
		}

		if (!socket)
			return ;

		socket.on('statusChange', eventHandler);

		return (() => {
			if (!socket)
				return;
			socket.off('statusChange', eventHandler);
		})
	}, [props.users])

    return (
        <div>
            {props.users.map((u: FriendDto) =>
                <div key={u.id}>
                            <span>
                                <div >
                                    <img
                                        src={u.pictureUrl != null ? u.pictureUrl : defaultAvatar}
                                        alt="Avatar User"
                                    />
                                </div>
                                <div>
									{
									(intra_id) ? <></> :
                                    <button onClick={() => {
                                        props.unfriend(u.id)
										props.setUsers(props.users.filter((user: FriendDto) => user.id !== u.id));
                                    }}>Unfriend</button>
									}
                                </div>
                            </span>
                    <span>
                                <span>
                                    <div>{u.name}</div>
                                    <div>{status.get(u.id)}</div>
                                </span>
                            </span>
                </div>)
            }
        </div>
    )
}

export default Friends