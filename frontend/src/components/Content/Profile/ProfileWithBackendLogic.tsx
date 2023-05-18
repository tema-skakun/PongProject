import style from './Profile.module.css'
import React, {useState} from 'react';
import './User.css';
import {blockProps} from '../../../props';
import pencil from './pencil.svg';
import JSCookies from 'js-cookie';

const Profile = (props: any) => {
    const [profilePic, setProfilePic] = useState<string>(props.userdata?.picture_url || '');
    const [haveChanges, setHaveChanges] = useState<boolean>(false);
    const [isUsernameEditable, setIsUsernameEditable] = useState<boolean>(false);
    const [username, setUsername] = useState<string>(props.userdata?.username || '');
    const [prevUsername, setPrevUsername] = useState<string>(props.userdata?.username || '');
    const [qrcode, setqrcode] = useState<any>();
    const [activating2F, setactivating2f] = useState<boolean>(false);
    const [activationCode, setactivationCode] = useState<string>('');

    const handleEdit = () => {
        setIsUsernameEditable(!isUsernameEditable);//если тру - покажет кнопки редактир
        setHaveChanges(false);
    };

    const handleCancel = () => {
        setIsUsernameEditable(false);
        setUsername(prevUsername);
        setProfilePic(props.userdata?.picture_url || '');
        setHaveChanges(false);
        setactivating2f(false);
    };

    async function handleActivate2f() {
        setactivating2f(true);
        const url = `http://${process.env.IP_BACKEND}:6969/2fa/generate`; // replace with your API endpoint URL
        const headers = {
            Accept: 'image/png',
            'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
        };
        const response = await fetch(url, {
            method: 'POST', // set the appropriate HTTP method
            headers: headers,
        });
        const qrCodeBuffer = await response.arrayBuffer();
        const qrCodeBlob = new Blob([qrCodeBuffer], {type: 'image/png'}); // Update with the appropriate MIME type
        const qrCodeImageUrl = URL.createObjectURL(qrCodeBlob);
        setqrcode(qrCodeImageUrl);
    }

    const formSubmit = async (e: any) => {
        e.preventDefault();
        if (activationCode) {
            const url = `http://${process.env.IP_BACKEND}:6969/2fa/turn-on`; // replace with your API endpoint URL
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
                .then(response => {
                    if (response.ok) {
                        // handle success response
                    } else {
                        alert('wrong code');
                    }
                })
        }
        if (profilePic || (username !== prevUsername)) {
            const url = `http://${process.env.IP_BACKEND}:6969/users/update`; // replace with your API endpoint URL
            const headers = {
                'Content-Type': 'application/json', // set the appropriate Content-Type header
                'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
            };
            const body = JSON.stringify({
                username: username,
                profilePic: profilePic,
            });
            fetch(url, {
                method: 'PUT', // set the appropriate HTTP method
                headers: headers,
                body: body,
            })
                .then(response => {
                    if (response.ok) {
                        // handle success response
                        props.userdata.username = username;
                        props.userdata.picture_url = profilePic;
                    } else {
                        alert('something wrong with picture or username update');
                    }
                })
        }
        setIsUsernameEditable(!isUsernameEditable);
        setHaveChanges(false);
    };

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);//редактирует имя юзера, но не отправляет в бд
        setHaveChanges(true);
    };

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 240; // specify the desired maximum width
                    const MAX_HEIGHT = 240; // specify the desired maximum height
                    let width = img.width;
                    let height = img.height;

                    // calculate new width and height while maintaining the aspect ratio
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    const optimizedImageDataUrl = canvas.toDataURL(file.type);
                    setProfilePic(optimizedImageDataUrl);
                    setHaveChanges(true);
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleActivationCode = (event: React.ChangeEvent<HTMLInputElement>) => {
        setactivationCode(event.target.value);//вводим код
        setHaveChanges(true);
    }

    return (
        <div className={style.profile}>
            <div>
                <form onSubmit={formSubmit}>
                    <img src={profilePic} alt="avatar"/>
                    <h1>
                        {isUsernameEditable ? (/*если тру - открывается редакция профиля*/
                            <>
                                <input type="text" value={username} onChange={handleUsernameChange}/>
                                <label htmlFor="imageInput" className="custom-file-upload">
                                    Change picture
                                </label>
                                <button type="button" className="cancel-button" onClick={handleCancel}>
                                    Cancel
                                </button>
                                {!activating2F &&
                                    <div>
                                        <button type="button" onClick={handleActivate2f}>
                                            Activate 2F
                                        </button>
                                    </div>}
                                <div>
                                    <>
                                        {activating2F && <img className='activating' src={qrcode} alt=''/>}{/*рисует куар код*/}
                                        {activating2F &&
                                            <div>
                                                <label>
                                                    Code:
                                                    <input type="text" value={activationCode}
                                                           onChange={handleActivationCode}/>
                                                </label>
                                            </div>}
                                    </>
                                </div>
                            </>
                        ) : (
                            <>
                                {username}
                                <button className="pencil-button" onClick={handleEdit}>
                                    <img src={pencil} alt="Edit"/>{/*кнопка редактирования*/}
                                </button>
                            </>
                        )}
                    </h1>
                    <input type="file" id="imageInput" onChange={handleImageChange}/>
                    {haveChanges && <button> Submit changes </button>}
                </form>
            </div>
        </div>
    );
}

export default Profile;