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
	const [username, setUsername] = useState<string>('Schlongo');

	let endpoint: string = `http://${process.env.REACT_APP_IP_BACKEND}:6969/users/user/`;



	useEffect(() => {
		const fullEnpoint = (intra_id) ? endpoint + intra_id : endpoint;
		axios.get(fullEnpoint, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			}
		}).then((res: AxiosResponse<any, any>) => {
			setPicUrl(res.data.picture_url);
			setUsername(res.data.username);

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
                    {username}
                </div>
				{ (intra_id) ?
				<></>:
                <div>
                    <EditProfile setUsername={setUsername} setPicUrl={setPicUrl} user={fetchedUser} setUser={setFetchedUser} />
                </div>
				}
                <div>
                    <WinsAndLosses user={fetchedUser} />
                </div>
                <div>
                    <Ladder/>
                </div>
                <div className={style.achievement}>
                    <Achievement/>
                </div>
            </div> 
            <div className={style.stat}>
                <h2>Match history</h2>
				<div>
                    <MatchItems username={username} picUrl={picUrl} matchHistoryList={matchHistoryList} setMatchHistoryList={setMatchHistoryList} user={fetchedUser} />
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
