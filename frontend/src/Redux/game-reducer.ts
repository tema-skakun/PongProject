let initialState:any = {
    friends: [
        {
            id: 1,
            name: 'Flash',
            avatarLink: 'https://avatarfiles.alphacoders.com/257/257694.jpg'},
        {
            id: 2,
            name: 'Batman',
            avatarLink: 'https://i.pinimg.com/474x/d7/d7/0e/d7d70e9056d2b0d46463f4ca5e1ea67b.jpg'
        },
        {
            id: 3,
            name: 'Spider-Man',
            avatarLink: 'https://assets.reedpopcdn.com/spider-man-walkthrough-guide-5014-1537780065472.jpg/BROK/thumbnail/1200x1200/quality/100/spider-man-walkthrough-guide-5014-1537780065472.jpg'
        },
        {
            id: 4,
            name: 'Wonder Woman',
            avatarLink: 'https://avatarfiles.alphacoders.com/116/116579.jpg'},
    ]
}
const gameReducer = (state:any = initialState, action: any) => {
    return state;
}

export default gameReducer;
