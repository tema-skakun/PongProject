import './App.css';
import Navbar from './components/Navbar/Navbar';
import Content from './components/Content/Content';
import JSCookies from 'js-cookie';
import {createContext, useEffect, useRef, useState} from 'react';
import {userProps} from './props';
import {LoginPage} from './components/LoginPage/LoginPage';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { InvitePopUp } from './components/Content/Game/components/InvitePopUp';
import { RejectionPopup } from './components/Content/Game/components/RejectionPopup';
import { Config } from './interfaces/config';
import { winningStates } from './components/Content/Game/Game';

export let socket: Socket<any, any> | null = null;

export let gSetShowRejection: Function = (b: boolean) => {console.log('You fucked up')};

function App(props: any) {
	const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [is2f, setis2f] = useState<boolean>(false);
    const userdata = useRef<userProps>();
	const [displayBtn, setDisplayBtn] = useState<boolean>(true);
	const [CONFIG, setCONFIG] = useState<Config | null>(null);
	const [showRejection, setShowRejection] = useState<boolean>(false);
	const winningRef: React.MutableRefObject<winningStates> = useRef(winningStates.undecided);
	const backgroundImg: React.MutableRefObject<HTMLImageElement> = useRef((() => {
		const img = new Image();
		img.src = '/default.png';
		return img;
	})());

    useEffect(() => {
		gSetShowRejection = setShowRejection;

        const myCookie = JSCookies.get('accessToken');

        if (!isLoggedIn && myCookie) {
            const url = `http://${process.env.REACT_APP_IP_BACKEND}:6969/authentication/log-in`;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
            };
            fetch(url, {
                method: 'GET',
                headers: headers,
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        setis2f(true);
                        throw new Error('Failed to authenticate2f');
                    }
                })
                .then(data => {
                    userdata.current = data;
                    setIsLoggedIn(true);

					if (!socket)
					{
						socket = io(`http://${process.env.REACT_APP_IP_BACKEND}:6969/game`, {
							withCredentials: true,
							path: '/gameListener'
						});
					}
                })
                .catch(error => {
                    console.error(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [isLoggedIn]);

	useEffect(() => {
		if (!socket)
			return ;

		socket.on('handshake', (CONFIG_STR: string) => {
			setCONFIG(JSON.parse(CONFIG_STR))
		})

		return (
			() => {if (socket) socket.off('handshake')}
		)
	}, [socket]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        isLoggedIn ? (
            <div className="App">
				<InvitePopUp socket={socket}
							setDisplayBtn={setDisplayBtn} />
				<RejectionPopup socket={socket} showRejection={showRejection} setShowRejection={setShowRejection}/>
                <Navbar/>
                <Content state={props.state} dispatch={props.dispatch} setIsLoggedIn={setIsLoggedIn}
                         userdata={userdata.current}
						 CONFIG={CONFIG}
						 setCONFIG={setCONFIG}
						 winningRef={winningRef}
						 backgroundImg={backgroundImg}/>
            </div>
        ) : (
            <div className="App">
                <LoginPage setis2f={setis2f} is2f={is2f} setIsLoggedIn={setIsLoggedIn} userdata={userdata.current}/>
            </div>
        )
    );
}

export default App;

