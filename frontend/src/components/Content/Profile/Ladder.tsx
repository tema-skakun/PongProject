import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import JSCookies from 'js-cookie';

export const Ladder: React.FC<any> = (props) => {
	const {intra_id} = useParams();
	const [percentile, setPercentile] = useState<number | string>(69);

	let endpoint: string = `http://${process.env.REACT_APP_IP_BACKEND}:6969/ladder/percentile/`;
	if (intra_id)
		endpoint = endpoint.concat(intra_id);

	useEffect(() => {
		axios.get(endpoint, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			}
		})
		.then((res: AxiosResponse<any, any>) => {
			console.log(res.data);
			setPercentile(res.data);
		})
	}, [])

	if (isNaN(Number(percentile)))
		return <span>Not ranked yet</span>

	return <span> PERCENTILE: {percentile}th</span>
}