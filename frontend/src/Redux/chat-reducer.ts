const UPDATE_NEW_MESSAGE_BODY = 'UPDATE-NEW-MESSAGE-BODY';
const SEND_MESSAGE = 'SEND-MESSAGE';

let initialState: any = {
    chatType: {1: "public", 2: "private", 3: "protected"},
    chat: [
        {
            id: 1,
            name: 'Linus',
            avatarLink: 'https://i.pinimg.com/originals/c1/f2/5f/c1f25f71f7dbc8413da545076118e054.jpg'
        },
        {
            id: 2,
            name: 'Boris',
            avatarLink: 'https://99px.ru/sstorage/1/2015/11/image_11111151003517187270.jpg'
        },
        {
            id: 3,
            name: 'Paul',
            avatarLink: 'https://irecommend.ru/sites/default/files/imagecache/copyright1/user-images/224480/P5jfvm3cJ7RzrPVLeo4kHA.jpg'
        },
        {
            id: 4,
            name: 'Evgeniy',
            avatarLink: 'https://cs14.pikabu.ru/post_img/2022/05/23/5/1653287994258846794.jpg'
        },
        {
            id: 5,
            name: 'Anton',
            avatarLink: 'https://bipbap.ru/wp-content/uploads/2017/11/5_ja7.jpg'},
        {
            id: 6,
            name: 'Alexander',
            avatarLink: 'https://proprikol.ru/wp-content/uploads/2019/08/kartinki-volk-iz-nu-pogodi-19.jpg'
        },
        {
            id: 7,
            name: 'Pablo',
            avatarLink: 'https://souzmult.ru/api/images/character-5d75efa0dfe23.svg'}
    ],
    messages: [
        {id: 1, message: 'Hi'},
        {id: 2, message: 'How are you?'},
        {id: 3, message: 'Yo'},
        {id: 4, message: 'Wazzzaaa?'},
        {id: 5, message: 'go dota'},
        {id: 6, message: 'Whatever'},
        {id: 7, message: 'bb gl'}
    ],
    newMessageBody: ''
}

const chatReducer = (state: any = initialState, action: any) => {

    switch (action.type) {
        case UPDATE_NEW_MESSAGE_BODY:
            return {
                ...state,
                newMessageBody: action.body
            };
        case SEND_MESSAGE:{
            let body: any = state.newMessageBody;
            return {
                ...state,
                newMessageBody: '',
                messages: [...state.messages, {id: 9, message: body}]
            }
        };
        default:
            return state;
    }
}

export const sendMessageActionCreator = () => ({type: SEND_MESSAGE})
export const updateNewMessageBodyCreator = (text: any) =>
    ({type: UPDATE_NEW_MESSAGE_BODY, body: text});

export default chatReducer;
