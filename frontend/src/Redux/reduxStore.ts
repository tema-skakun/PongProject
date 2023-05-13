import {combineReducers, legacy_createStore as createStore} from "redux";
import chatReducer from "./chat-reducer";
import profileReducer from "./profile-reducer";
import gameReducer from "./game-reducer";

let reducers:any = combineReducers({
    profilePage: profileReducer,
    chatPage: chatReducer,
    gamePage: gameReducer
});

let store : any = createStore(reducers);

export default store;