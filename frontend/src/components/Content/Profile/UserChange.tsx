import React, { useState } from 'react';
import './User.css';
// import blockProps from '../../../types';
import pencil from './pencil.svg';
// import socket from '../../../socket';
import JSCookies from 'js-cookie';

export const UserChange = (props: any) => {
  const [profilePic, setProfilePic] = useState<string>(props.user?.picture_url || '');
  const [haveChanges, setHaveChanges] = useState<boolean>(false);
  const [isUsernameEditable, setIsUsernameEditable] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(props.user?.username || '');
  const [prevUsername, setPrevUsername] = useState<string>(props.user?.username || '');
  const [qrcode, setqrcode] = useState<string>();
  const [activating2F, setactivating2f] = useState<boolean>(false);
  const [activationCode, setactivationCode] = useState<string>('');

  const handleEdit = () => {
    setIsUsernameEditable(!isUsernameEditable);
    setHaveChanges(false);
  };

  const handleCancel = () => {
    setIsUsernameEditable(false);
    setUsername(prevUsername);
    setProfilePic(props.user?.picture_url || '');
    setHaveChanges(false);
	setactivating2f(false);
  };

  const handleActivate2f = () => {
	// const myCookie = JSCookies.get('accessToken');
    // socket.emit('generate', {
    //   myCookie,
    // });
    // socket.on('qr-code', (data) => {
    //   if (data !== '') {
	// 	setqrcode(data);
	// 	setactivating2f(true);
    //   } else {
	// 		console.log('else')
	//   }
    // });
  }

  const formSubmit = async (e: any) => {
    // e.preventDefault();
	// if (haveChanges) {
	// 	const myCookie = JSCookies.get('accessToken');
	// 	socket.emit('userUpdate', {
	// 	myCookie,
	// 	picture_url: profilePic,
	// 	username,
	// 	});
	// 	socket.on('userUpdate', (data) => {
	// 	if (data !== '') {
	// 		alert(data.message);
	// 		setUsername(prevUsername);
	// 	} else setPrevUsername(username);
	// 	});
	// }
	// if (activationCode !== '') {
		// const myCookie = JSCookies.get('accessToken');
		// socket.emit('2factivationCode', {
		// 	myCookie,
		// 	code: activationCode,
		// });
		// socket.on('2factivationCode', (data) => {
		// 	if (data !== '') {
		// 		alert(data);
		// 	} else {
		// 		alert('2F activated');
		// 	};
		// });
	// }
    setHaveChanges(false);
    setIsUsernameEditable(false);
	setactivationCode('');
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
    setHaveChanges(true);
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setProfilePic(reader.result as string);
        setHaveChanges(true);
      };
    }
  };

  const handleActivationCode = (event: React.ChangeEvent<HTMLInputElement>) => {
	setactivationCode(event.target.value);
	setHaveChanges(true);
  }

  return (
    <div className="user">
      <div>
        <form onSubmit={formSubmit}>
          <img src={profilePic} alt="avatar" />
          <h1>
            {isUsernameEditable ? (
              <>
                <input type="text" value={username} onChange={handleUsernameChange} />
                <label htmlFor="imageInput" className="custom-file-upload">
                  Change picture
                </label>
				<button type="button" className="cancel-button" onClick={handleCancel}>
                Cancel
              	</button>
				  {!activating2F && <div>
						<button type="button" onClick={handleActivate2f}>
							Activate 2F
						</button>
					</div>}
					<div>
						<>
						{activating2F && <img className='activating' src={qrcode} alt=''/>}
						{activating2F && <div>
							<label>
								Code:
								<input type="text" value={activationCode} onChange={handleActivationCode} />
							</label>
						</div>}
						</>
					</div>
              </>
            ) : (
              <>
                {username}
                <button className="pencil-button" onClick={handleEdit}>
                  <img src={pencil} alt="Edit" />
                </button>
              </>
            )}
          </h1>
          <input type="file" id="imageInput" onChange={handleImageChange} />
          {haveChanges && <button> Submit changes </button>}
        </form>
      </div>
    </div>
  );
};