import style from './Profile.module.css';
import FriendsAPIComponent from './Friends/FriendsAPIComponent';
import MatchItems from "./MatchItems/MatchItems";
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
            </div>
            <div className={style.stat}>
                Match history
				<div>
                    <MatchItems />
                </div>
            </div>
            <div className={style.friends}>
                Friends
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
