import defaultAvatar from "../../../../assets/images/defaultAvatar.png";
import React from "react";

type FriendDto = {
    name: string;
    id: number;
    pictureUrl?: string;
    status: string;
};

let Friends = (props: any) => {

    return (
        <div>
            {props.users.map((u: FriendDto) =>
                <div key={u.id}>
                            <span>
                                <div>
                                    <img
                                        src={u.pictureUrl != null ? u.pictureUrl : defaultAvatar}
                                        alt="Avatar User"
                                    />
                                </div>
                                <div>
                                    <button onClick={() => {
                                        props.unfriend(u.id)
                                    }}>Unfriend</button>
                                </div>
                            </span>
                    <span>
                                <span>
                                    <div>{u.name}</div>
                                    <div>{u.status}</div>
                                </span>
                            </span>
                </div>)
            }
        </div>
    )
}

export default Friends