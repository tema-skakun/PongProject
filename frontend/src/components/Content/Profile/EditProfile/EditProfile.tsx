import { Button, Dropdown, Form } from "react-bootstrap";
import { BsGearFill } from "react-icons/bs";
import { Modal } from "react-bootstrap";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import JSCookies from 'js-cookie';
import TwoFactorAuthSwitch from "./twofactor";
import { propTypes } from "react-bootstrap/esm/Image";
import { MatchHistoryEntry } from "../MatchItems/MatchItems";

const EditProfile = (props: any) => {
	const [newUsername, setNewUsername] = useState(''); // state for the new username
    const [showUsernameModal, setShowUsernameModal] = useState(false); // state for showing the username modal
	const  fileRef: any = useRef();
	const [curFile, setCurFile] = useState<string | Blob>();
	const [showTwoFactorAuth, setShowTwoFactorAuth] = useState(false);

	// console.log('edit profile');
	const handleFileChange = useCallback(async (e: any) => {
		const file = e.target.files[0];

		if (file && file.type.startsWith('image/')) {
			setCurFile(file);
		  } else {
			alert('please select an image file.');
		  }
	}, [setCurFile])

	useEffect(() => {
		if (!curFile)
			return ;

		// console.log(`This should be true: ${curFile instanceof File}`);
		const formData =  new FormData();
		formData.append('file', curFile);

		axios.put(`http://${process.env.REACT_APP_IP_BACKEND}:6969/aws/upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			}
		})
		.then(response => {
			props.setUser({...props.user, picture_url: response.data.url})

			const newList: MatchHistoryEntry [] = [];
			for (const entry of props.matchHistoryList)
			{
				if (entry.looser.intra_id === props.user.intra_id)
				{
					newList.push({...entry, looser: {...entry.looser, picture_url: response.data.url}});
				} 
				else if (entry.winner.intra_id === props.user.intra_id){
					newList.push({...entry, winner: {...entry.winner, picture_url: response.data.url}});
				}
			}
			props.setMatchHistoryList(newList);

			console.log(`uploaded file successfully to: ${JSON.stringify(response)}`);
		})
		.catch(error => {
			console.log(JSON.stringify(error));
		})

	}, [curFile])

	const triggerFileInput = useCallback(() => {
		if (fileRef.current)
			fileRef.current.click();
	}, [fileRef])

    const changeUsername = useCallback(() => {
        axios.put(`http://${process.env.REACT_APP_IP_BACKEND}:6969/users/update/username`, {
            username: newUsername
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
            }
        }).then((response) => {
            setShowUsernameModal(false); // close the modal after the request is complete
            setNewUsername(''); // reset the new username
			props.setUser({...props.user, username: response.data})
        })
    }, [newUsername, setNewUsername, setShowUsernameModal]);

	const handleTwoFactorAuthClick = () => {
		setShowTwoFactorAuth(!showTwoFactorAuth);
	};

    return (
        <div>
            <input type='file' style={{display: 'none'}} ref={fileRef} onChange={handleFileChange} />

            <Dropdown>
                <Dropdown.Toggle variant="custom" id="dropdown-basic">
                    Edit Profile<BsGearFill/>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={triggerFileInput}>Change pic</Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowUsernameModal(true)}>Change username</Dropdown.Item>
                    <Dropdown.Item onClick={handleTwoFactorAuthClick}>Two-Factor Authentication </Dropdown.Item>
                </Dropdown.Menu>

                <Modal show={showUsernameModal} onHide={() => setShowUsernameModal(false)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>Change Username</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>New Username:</Form.Label>
                            <Form.Control type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowUsernameModal(false)}>Close</Button>
                        <Button variant="primary" onClick={changeUsername}>Change</Button>
                    </Modal.Footer>
                </Modal>
				<TwoFactorAuthSwitch showModal={showTwoFactorAuth} onClose={handleTwoFactorAuthClick} user={props.user} setUser={props.setUser}/>
            </Dropdown>
        </div>
    );
}

export default EditProfile;