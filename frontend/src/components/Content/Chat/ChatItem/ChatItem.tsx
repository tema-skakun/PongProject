import style from './ChatItem.module.css'
import React from "react";
import {NavLink} from "react-router-dom";

const DialogItem = (props:any) => {
    let path = "/chat/chat/" + props.id;

    return (
        <div className={style.dialogsItems}>
            <img
                src={props.ava}
                alt="Avatar"
            />
            <NavLink
                className={style.dialogsItems}
                to={path}>
                {props.name}
            </NavLink>
        </div>
    )
}

export default DialogItem;
