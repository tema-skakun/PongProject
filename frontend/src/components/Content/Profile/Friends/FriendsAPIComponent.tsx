import axios from 'axios';
import React, { useEffect } from 'react';
import JSCookies from 'js-cookie';
import Friends from './Friends';
import { useParams } from 'react-router-dom';

const BACKEND_PORT: string = ':6969';
const URL: string = '/friends/displayable/';

const URL_FOR_DEL_FRIENDS: string = '/friends/';

const BACKEND_ADDR: string = "http://" + process.env.REACT_APP_IP_BACKEND + BACKEND_PORT + URL;
const ROOT_ADDR_OF_FRIENDS: string = "http://" + process.env.REACT_APP_IP_BACKEND + BACKEND_PORT + URL_FOR_DEL_FRIENDS;

function unfriend(intraId: number) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
    };

    axios.delete(ROOT_ADDR_OF_FRIENDS + intraId, {
        method: 'DELETE',
        headers: headers,
    })
}

const FriendsAPIComponent: React.FC<any> = (props) =>  {

	const {intra_id} = useParams();

	useEffect(() => {
		const addr = (intra_id) ? BACKEND_ADDR + intra_id : BACKEND_ADDR;

        const headers: any = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
        };

        axios.get(addr, {
            headers: headers
        })
            .then((response: any) => {
                props.setUsers(response.data);
            });

        // axios.delete(ROOT_ADDR_OF_FRIENDS, {
        //     method: 'DELETE',
        //     headers: headers,
        // })
        //     .then((response: any) => {
        //     this.props.unfriend(response.data.intraId);
        // });

    }, [intra_id]);


	return (
		<Friends
			users={props.profilePage.users}
			follow={props.follow}
			unfollow={props.unfollow}
			unfriend={unfriend}
			setUsers={props.setUsers}
		/>
	)
}

export default FriendsAPIComponent