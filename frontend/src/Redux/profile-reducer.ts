const FOLLOW = 'FOLLOW';
const UNFOLLOW = 'UNFOLLOW';
const SET_USERS = 'SET-USERS';

let initialState: any = {
    user: {
        id: 1,
        login: "fdarkhaw",
        password: "Qwerty_12345",
        name: "Darkhawk",
        userAvatar: "https://playcontestofchampions.com/wp-content/uploads/2021/11/champion-darkhawk.jpg",
        userFriends: [],
        userStatus: {1: "online", 2: "offline", 3: "in a waiting room", 4: "in a game"},
        statWins: 0,
        statLosses: 0,
        ladderLevel: 0,//for example: for winning +10ex, for losing -5ex
        userAchievements: []
    },
    users: [],
    allAchievements: {
        unstoppable: "10 wins in a row",
        invincible: "5 wins in a row"
    },
    isFetching: false,
}


const profileReducer = (state: any = initialState, action: any) => {

    switch (action.type) {
        case FOLLOW:
            return {
                ...state,
                users: state.users.map((u: any) => {
                    if (u.id === action.userId) {
                        return {...u, followed: true}
                    }
                    return u;
                })
            }
        case UNFOLLOW:
            return {
                ...state,
                users: state.users.map((u: any) => {
                    if (u.id === action.userId) {
                        return {...u, followed: false}
                    }
                    return u;
                })
            }
        case SET_USERS:
            return {...state, users: [...action.users]}
        default:
            return state;
    }

}

export const follow = (userId: any) => ({type: FOLLOW, userId})
export const unfollow = (userId: any) => ({type: UNFOLLOW, userId})
export const setUsers = (users: any) => ({type: SET_USERS, users})

export default profileReducer;
