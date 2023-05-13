import {sendMessageActionCreator, updateNewMessageBodyCreator,} from "../../../Redux/chat-reducer";
import Chat from "./Chat";
import {connect} from "react-redux";

let mapStateToProps = (state:any) => {
    return {
        chatPage: state.chatPage
    }
}
let mapDispatchToProps = (dispatch:any) => {
    return {
        updateNewMessageBody: (body:any) => {
            dispatch(updateNewMessageBodyCreator(body))
        },
        sendMessage: () => {
            dispatch(sendMessageActionCreator())
        }
    }
}

const ChatContainer:any = connect(mapStateToProps, mapDispatchToProps)(Chat);

export default ChatContainer;