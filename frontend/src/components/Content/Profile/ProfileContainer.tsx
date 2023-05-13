import {connect} from 'react-redux';
import Profile from './Profile';
import {follow, setUsers, unfollow} from "../../../Redux/profile-reducer";

let mapStateToProps = (state: any) => {
    return {
        profilePage: state.profilePage
    }
}

const ProfileContainer: any = connect(mapStateToProps, {follow, unfollow, setUsers})(Profile);

export default ProfileContainer;