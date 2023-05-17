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

	const { setMatchHistoryList } = props;

	// useEffect(() => {
	// 	console.log('Empty dependencies of MatchItems');
	// }, [])

	// useEffect(() => {
	// 	console.log('Props dependeny of matchItems');
	// }, [props])

	useEffect(() => {
		const baseUrl = (intra_id) ? endpoint + intra_id : endpoint;
		axios.get(baseUrl, {
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
			props.matchHistoryList.map((entry: MatchHistoryEntry) => 
			<div className={style.match} key={entry.id}>
				<div className={style.player1}>

					{ (props.user.intra_id === entry.winner.intra_id) ?
					<img alt="winner profile pic" src={props.picUrl}></img> :
					<img alt="winner profile pic" src={entry.winner.picture_url}/>
					}
					<div>{entry.winner.username}</div>
				</div>
				<div className={style.score}>
					<h3>VS</h3>
					<div>{entry.winnerGoals} : {entry.looserGoals}</div>
				</div>
				<div className={style.player2}>
					{ (props.user.intra_id === entry.looser.intra_id) ?
					<img alt="looser profile pic" src={props.picUrl}></img> :
					<img alt="looser profile pic" src={entry.looser.picture_url}/>
					}
					<div>{entry.looser.username}</div>
				</div>
			</div>)
			}
		</span>
    )
}

export default MatchItems