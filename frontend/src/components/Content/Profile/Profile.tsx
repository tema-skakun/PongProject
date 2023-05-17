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
import { UserChange } from './UserChange';
import { MatchHistoryEntry } from './MatchItems/MatchItems';
import { match } from 'assert';

const Profile = (props: any) => {
	const {intra_id} = useParams();
	const [fetchedUser, setFetchedUser] = useState<Record<string, any>>({});
	const [matchHistoryList, setMatchHistoryList] = useState<MatchHistoryEntry []>([]);

	// console.log('profile');
	let endpoint: string = `http://${process.env.REACT_APP_IP_BACKEND}:6969/users/user/`;
	if (intra_id)
		endpoint = endpoint.concat(intra_id);

	// console.log(endpoint);
	useEffect(() => {
		axios.get(endpoint, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			}
		}).then((res: AxiosResponse<any, any>) => {
			// console.log(`inital: ${JSON.stringify(props.profilePage.user)}`);
			// console.log(JSON.stringify(res.data));
			// props.profilePage.user = res.data;
			setFetchedUser(res.data);
		})
	}, []);

	// console.log(`newPicture: ${fetchedUser.picture_url}`);

    return (
        <div className={style.profile}>
            <div className={style.user}>
                <img
                    src={fetchedUser.picture_url}
                    alt="Avatar"
                />
                <div>
                    {fetchedUser.username}
                </div>
				{ (intra_id) ?
				<></>:
                <div>
                    <EditProfile user={fetchedUser} setUser={setFetchedUser} setMatchHistoryList={setMatchHistoryList} matchHistoryList={matchHistoryList} />
                </div>
				}
                <div>
                    <WinsAndLosses user={fetchedUser} />
                </div>
                <div>
                    <Ladder/>
                </div>
				{/* <div>
					<UserChange user={fetchedUser} />
				</div> */}
                <div>
                    <Achievement/>
                </div>
            </div> 
            <div className={style.stat}>
                <h2>Match history</h2>
				<div>
                    <MatchItems matchHistoryList={matchHistoryList} setMatchHistoryList={setMatchHistoryList} />
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
