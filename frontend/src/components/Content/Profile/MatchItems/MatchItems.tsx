import React, { useEffect, useState } from "react";
import style from './MatchItems.module.css'
import axios, { AxiosResponse } from "axios";
import JSCookies from 'js-cookie';

type MatchHistoryEntry = {
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

	const [matchHistoryList, setMatchHistoryList] = useState<MatchHistoryEntry []>([]);

	useEffect(() => {
		axios.get(`http://${process.env.REACT_APP_IP_BACKEND}:6969/match-history/`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			}
		})
		.then((res: AxiosResponse<any, any>) => {
			setMatchHistoryList(res.data);
		})
	}, [setMatchHistoryList])

    return (
		<span>
			{
			matchHistoryList.map((entry: MatchHistoryEntry) => 
			<div className={style.match} key={entry.id}>
				<div className={style.player1}>
					<img src={entry.winner.picture_url}></img>
					<div>{entry.winner.username}</div>
				</div>
				<div className={style.score}>
					<h3>VS</h3>
					<div>{entry.winnerGoals} : {entry.looserGoals}</div>
				</div>
				<div className={style.player2}>
					<img src={entry.looser.picture_url}></img>
					<div>{entry.looser.username}</div>
				</div>
			</div>)
			}
		</span>
    )
}

export default MatchItems