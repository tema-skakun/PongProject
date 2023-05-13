import React from "react";
import style from './MatchItems.module.css'

let MatchItems = (props: any) => {
    return (
        <div className={style.match}>
            <div className={style.player1}>
                <div>My name</div>
                <div>My picture</div>
            </div>
            <div className={style.score}>
                <h1>VS</h1>
                <div>10 : 5</div>
            </div>
            <div className={style.player2}>
                <div>Enemy name</div>
                <div>Enemy picture</div>
            </div>
        </div>
    )
}

export default MatchItems