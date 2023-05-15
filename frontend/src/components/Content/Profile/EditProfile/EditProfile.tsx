import { Dropdown, Form } from "react-bootstrap";
import { BsGearFill } from "react-icons/bs";
import { Modal } from "react-bootstrap";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import JSCookies from 'js-cookie';

const EditProfile = (props: any) => {

	const  fileRef: any = useRef();
	const [curFile, setCurFile] = useState<string | ArrayBuffer>();

	const handleFileChange = useCallback(async (e: any) => {
		const file = e.target.files[0];

		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();

			reader.onloadend = () => {
				if (reader.result)
					setCurFile(reader.result);
			}
			reader.readAsDataURL(file);

		  } else {
			alert('please select an image file.');
		  }
	}, [setCurFile])

	useEffect(() => {
		if (!curFile)
			return ;

		console.log(`hits put with: ${curFile}`);
		axios.put(`http://${process.env.REACT_APP_IP_BACKEND}:6969/users/update/`, {
			username: props.user.username,
			profilePic: curFile
		}, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${JSCookies.get('accessToken')}`,
			}
		})

	}, [curFile])

	const triggerFileInput = useCallback(() => {
		if (fileRef.current)
			fileRef.current.click();
	}, [fileRef])

    return (
        <div>
			<input type='file' style={{display: 'none'}} ref={fileRef} onChange={handleFileChange} />


			<Dropdown>
		<Dropdown.Toggle variant="custom" id="dropdown-basic">
			Edit Profile<BsGearFill/>
		</Dropdown.Toggle>

		<Dropdown.Menu>
			<Dropdown.Item onClick={triggerFileInput}>Change pic</Dropdown.Item>
			<Dropdown.Item onClick={() => {}}>Change username</Dropdown.Item>
			<Dropdown.Item onClick={(e) => {e.stopPropagation()} }>
				<Form.Check 
				type="switch"
				id="custom-switch"
				label="Toggle label"
				onChange={() => {}}
				/>
			</Dropdown.Item>

		</Dropdown.Menu>
		<Modal show={false} onHide={() => {}} backdrop="static" keyboard={false}>
			
		</Modal>
		<Modal show={false} onHide={() => {}} backdrop="static" keyboard={false}>

		</Modal>
		</Dropdown>
        </div>
    )
}

export default EditProfile;