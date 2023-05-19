import {Routes, Route} from "react-router-dom";
import style from './Content.module.css'
import Game from "./Game/Game";
import ProfileContainer from "./Profile/ProfileContainer";
import MemeOverlay from "./Game/components/memeOverlay";
import Chat from "./Chat/Chat";

const Content = (props: any) => {

    return (
        <div className={style.content}>
            <Routes>
				<Route path="/" element={<ProfileContainer/>} />
				<Route path="/profile/:intra_id" element={<ProfileContainer/>}/>
                <Route path='/profile' element={<ProfileContainer />}/>
                <Route path='/chat' element={<Chat
                        dispatch={ props.dispatch }
						userdata={ props.userdata }
                    />}/>
                <Route path='/game' element={<Game displayBtn={props.displayBtn} setDisplayBtn={props.setDisplayBtn} backgroundImg={props.backgroundImg} winningRef={props.winningRef} CONFIG={props.CONFIG} setCONFIG={props.setCONFIG}/>}/>
				<Route path='/meme' element={<MemeOverlay memeUrl='/pug-dance.gif' showMeme={true} />}/>
            </Routes>
        </div>
    )
}

export default Content;