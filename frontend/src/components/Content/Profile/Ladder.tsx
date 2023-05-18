import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import JSCookies from 'js-cookie';

const Url: string = `http://${process.env.REACT_APP_IP_BACKEND}:6969/ladder/percentile/`;

export const Ladder: React.FC<any> = (props) => {
	const {intra_id} = useParams();
	const [percentile, setPercentile] = useState<number | string>(69);

	useEffect(() => {
		const endpoint: string = (intra_id) ? Url + intra_id : Url
		axios.get(endpoint, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			}
		})
		.then((res: AxiosResponse<any, any>) => {
			setPercentile(res.data);
		})
	}, [intra_id])

	if (isNaN(Number(percentile)))
		return <span>Not ranked yet</span>

	return <span> PERCENTILE: {Number(percentile).toFixed(2)}th</span>
}