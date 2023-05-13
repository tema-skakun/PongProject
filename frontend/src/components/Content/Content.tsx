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
                <Route path='/profile' element={<ProfileContainer/>}/>
                <Route path='/chat' element={<Chat
                        dispatch={ props.dispatch }
						userdata={ props.userdata }
                    />}/>
                <Route path='/game' element={<Game/>}/>
				<Route path='/meme' element={<MemeOverlay memeUrl='/pug-dance.gif' showMeme={true} />}/>
            </Routes>
        </div>
    )
}

export default Content;