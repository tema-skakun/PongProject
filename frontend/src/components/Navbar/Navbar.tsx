import {NavLink} from 'react-router-dom';
import style from './Navbar.module.css'

const Navbar = () => {
    return (
        <div className={style.navbar}>
            <div className={style.profile}>
                <NavLink
                    to='/profile'
                    className={navData =>
                        navData.isActive ? style.active : style.notActive}
                >
                    <h3>Profile</h3>
                </NavLink>
            </div>
            <div className={style.chat}>
                <NavLink
                    to='/chat'
                    className={navData =>
                        navData.isActive ? style.active : style.notActive}
                >
                    <h3>Chat</h3>
                </NavLink>

            </div>
            <div className={style.game}>
                <NavLink
                    to='/game'
                    className={navData =>
                        navData.isActive ? style.active : style.notActive}
                >
                    <h3>Game</h3>
                </NavLink>
            </div>
        </div>
    )
}

export default Navbar;