import './LoginPage.css'
import logo from '../.././42.png';
import { useState } from 'react';
import { twofprops, blockProps } from '../../props';
import JSCookies from 'js-cookie';

async function signin() {
	try {
		if (process.env.REACT_APP_INTRA_SIGNIN_LINK)
			window.location.assign(process.env.REACT_APP_INTRA_SIGNIN_LINK);
	} catch(error)
	{
	}
} 

export const LoginPage = (props: twofprops, props2: blockProps) => {
	// const [is2f, setis2f] = useState<boolean>(props.userdata?.isTwoFactorAuthenticationEnabled || false);
	const [activationCode, setactivationCode] = useState<string>('');

	const handleActivationCode = (event: React.ChangeEvent<HTMLInputElement>) => {
		setactivationCode(event.target.value);
	}


	const formSubmit = async (e: any) => {
		e.preventDefault();
		const url = `http://${process.env.REACT_APP_IP_BACKEND}:6969/2fa/authenticate`; // replace with your API endpoint URL
		const headers = {
			'Content-Type': 'application/json', // set the appropriate Content-Type header
			'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
		};
		const body = JSON.stringify({
			twoFactorAuthenticationCode: activationCode,
		});
		fetch(url, {
			method: 'POST', // set the appropriate HTTP method
			headers: headers,
			body: body,
		})
		.then(async response => {
		if (response.ok) {
			// handle success response
			const newToken = await response.text();
			JSCookies.set('accessToken', newToken);
			window.location.reload();
			// return response.json();
		} else {
			// handle error response
			throw new Error('Failed to authenticate2f');
		}
		})
		.catch(error => {
		// handle error
			console.error(error);
			alert(error);
		});
	  };

	return (
		<div className="App">
			<header className="App-header">
			<img src={logo} alt="42" className="logo"/>
			<h2>
				Welcome to our ft_transcendence
			</h2>
			{ !props.is2f ? (
				<div>
					<button className="signin-button" onClick={signin} >Sign in with 42 </button>
				</div>
				) : (
					<form onSubmit={formSubmit}>
					<label>
						Code:
						<input type="text" value={activationCode} onChange={handleActivationCode} />
					</label>
					<button> Submit </button>
					</form>
				)
			}
			</header>
		</div>
	)
}