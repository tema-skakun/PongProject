import style from './Profile.module.css';
import FriendsAPIComponent from './Friends/FriendsAPIComponent';
import MatchItems from "./MatchItems/MatchItems";
import EditProfile from "./EditProfile/EditProfile";
import { useParams } from 'react-router-dom';
import { WinsAndLosses } from './WinsAndLosses';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import JSCookies from 'js-cookie';
import { Ladder } from './Ladder';
import { Achievement } from './Achievement';
import { MatchHistoryEntry } from './MatchItems/MatchItems';

const Profile = (props: any) => {
	const {intra_id} = useParams();
	const [fetchedUser, setFetchedUser] = useState<Record<string, any>>({});
	const [matchHistoryList, setMatchHistoryList] = useState<MatchHistoryEntry []>([]);
	const [picUrl, setPicUrl] = useState<string>('');

	// console.log('profile');
	let endpoint: string = `http://${process.env.REACT_APP_IP_BACKEND}:6969/users/user/`;

	useEffect(() => {
		console.log('Empty dependencies of MatchItems');
	}, [])

	useEffect(() => {
		console.log('Props dependeny of matchItems');
	}, [props])


	// console.log(endpoint);
	useEffect(() => {
		const fullEnpoint = endpoint + intra_id;
		axios.get(fullEnpoint, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			}
		}).then((res: AxiosResponse<any, any>) => {
			setPicUrl(res.data.picture_url);
			// console.log(`inital: ${JSON.stringify(props.profilePage.user)}`);
			// console.log(JSON.stringify(res.data));
			// props.profilePage.user = res.data;
			setFetchedUser(res.data);
		})
	}, [endpoint, intra_id, setPicUrl]);

    return (
        <div className={style.profile}>
            <div className={style.user}>
                <img
                    src={picUrl}
                    alt="Avatar"
                />
                <div>
                    {fetchedUser.username}
                </div>
				{ (intra_id) ?
				<></>:
                <div>
                    <EditProfile setPicUrl={setPicUrl} user={fetchedUser} setUser={setFetchedUser} />
                </div>
				}
                <div>
                    <WinsAndLosses user={fetchedUser} />
                </div>
                <div>
                    <Ladder/>
                </div>
                <div>
                    <Achievement/>
                </div>
            </div> 
            <div className={style.stat}>
                <h2>Match history</h2>
				<div>
                    <MatchItems picUrl={picUrl} matchHistoryList={matchHistoryList} setMatchHistoryList={setMatchHistoryList} user={fetchedUser} />
                </div>
            </div>
            <div className={style.friends}>
                <h2>Friends</h2>
                <FriendsAPIComponent
                    profilePage={props.profilePage}
                    setUsers={props.setUsers}
                    follow={props.follow}
                    unfollow={props.unfollow}
                />
            </div>
        </div>
    )
}

export default Profile;
