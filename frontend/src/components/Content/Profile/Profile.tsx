import style from './Profile.module.css';
import FriendsAPIComponent from './Friends/FriendsAPIComponent';
import MatchItems from "./MatchItems/MatchItems";
import EditProfile from "./EditProfile/EditProfile";
const Profile = (props: any) => {
    return (
        <div className={style.profile}>
            <div className={style.user}>
                <img
                    src={props.profilePage.user.userAvatar}
                    alt="Avatar"
                />
                <div>
                    {props.profilePage.user.name}
                </div>
                <div>
                    <EditProfile/>
                </div>
                <div>
                    wins and losses
                </div>
                <div>
                    Ladder level
                </div>
                <div>
                    Achievement
                </div>
            </div>
            <div className={style.stat}>
                <h2>Match history</h2>
				<div>
                    <MatchItems />
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
