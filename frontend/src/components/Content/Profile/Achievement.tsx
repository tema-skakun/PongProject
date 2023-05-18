import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import JSCookies from 'js-cookie';

type ArchivementsTransformed = {
	id: number;

	holder: Record<string, any>;

	type: number;
}

const Url: string = `http://${process.env.REACT_APP_IP_BACKEND}:6969/archivements/`;

export const Achievement: React.FC<any> = (props) => {
	const {intra_id} = useParams();
	const [achievements, setAchievements] = useState<Set<number> >();

	useEffect(() => {
		const endpoint: string = (intra_id) ? Url + intra_id : Url

		axios.get(endpoint, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			}
		})
		.then((res: AxiosResponse<any, any>) => {
			const achievements: ArchivementsTransformed [] = res.data;

			const achivementTypes: Set<number> = new Set();
			for (const achievement of achievements)
			{
				if (!achivementTypes.has(achievement.type))
				{
					achivementTypes.add(achievement.type);
				}
			}
			setAchievements(achivementTypes);
		})
	}, [intra_id])

	return <span>{
		(achievements?.has(0)) ? <img src="/puginpool.jpeg"></img> : <></>}
		{(achievements?.has(1)) ? <img src="/triggeredMedal.jpeg"></img> : <></>}</span>
}