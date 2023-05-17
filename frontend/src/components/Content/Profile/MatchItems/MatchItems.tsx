import React, { useEffect, useState } from "react";
import style from './MatchItems.module.css'
import axios, { AxiosResponse } from "axios";
import JSCookies from 'js-cookie';
import { useParams } from "react-router-dom";

export type MatchHistoryEntry = {
	id: number;
	looser: {
		intra_id: number;
		username: string;
		picture_url: string;
	};
	winner: {
		intra_id: number;
		username: string;
		picture_url: string;
	};
	looserGoals: number;
	winnerGoals: number;
}

let MatchItems = (props: any) => {
	const {intra_id} = useParams();
	const endpoint = `http://${process.env.REACT_APP_IP_BACKEND}:6969/match-history/`;

	useEffect(() => {
		const baseUrl = (intra_id) ? endpoint.concat(intra_id) : endpoint;
		axios.get(baseUrl, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			}
		})
		.then((res: AxiosResponse<any, any>) => {
			props.setMatchHistoryList(res.data);
		})
	}, [props, endpoint])

    return (
		<span>
			{
			props.matchHistoryList.map((entry: MatchHistoryEntry) => 
			<div className={style.match} key={entry.id}>
				<div className={style.player1}>
					<img alt="winner profile pic" src={entry.winner.picture_url}></img>
					<div>{entry.winner.username}</div>
				</div>
				<div className={style.score}>
					<h3>VS</h3>
					<div>{entry.winnerGoals} : {entry.looserGoals}</div>
				</div>
				<div className={style.player2}>
					<img alt="looser profile pic" src={entry.looser.picture_url}></img>
					<div>{entry.looser.username}</div>
				</div>
			</div>)
			}
		</span>
    )
}

export default MatchItems