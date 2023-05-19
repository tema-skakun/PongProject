import { useEffect} from "react";
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

const Url = `http://${process.env.REACT_APP_IP_BACKEND}:6969/match-history/`;

let MatchItems = (props: any) => {
	const {intra_id} = useParams();

	const { setMatchHistoryList } = props;


	useEffect(() => {
		const baseUrl = (intra_id) ? Url + intra_id : Url;
		axios.get(baseUrl, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			}
		})
		.then((res: AxiosResponse<any, any>) => {
			setMatchHistoryList(res.data);
		})
	}, [setMatchHistoryList, intra_id])

    return (
		<span>
			{
			props.matchHistoryList.map((entry: MatchHistoryEntry) => 
			<div className={style.match} key={entry.id}>
				<div className={style.player1}>

					{ (props.user.intra_id === entry.winner.intra_id) ?
					<span>
						<img alt="winner profile pic" src={props.picUrl}></img>
						<div>{props.username}</div>
					</span>
					:
					<span>
						<img alt="winner profile pic" src={entry.winner.picture_url}/>
						<div>{entry.winner.username}</div>
					</span>
					}
					
				</div>
				<div className={style.score}>
					<h3>VS</h3>
					<div>{entry.winnerGoals} : {entry.looserGoals}</div>
				</div>
				<div className={style.player2}>
					{ (props.user.intra_id === entry.looser.intra_id) ?
					<span>
						<img alt="looser profile pic" src={props.picUrl}></img>
						<div>{props.username}</div>
					</span>
					:
					<span>
						<img alt="looser profile pic" src={entry.looser.picture_url}/>
						<div>{entry.looser.username}</div>
					</span>
					}
				</div>
			</div>)
			}
		</span>
    )
}

export default MatchItems