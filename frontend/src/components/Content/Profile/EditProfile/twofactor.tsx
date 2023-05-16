import { useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';

function haha() {
	console.log('haha')
}

function TwoFactorAuthSwitch() {
	// const [isChecked, setIsChecked] = useState(false);
	const [toggleSwitch, setToggleSwitch] = useState<boolean>(false);
	let bool = false;


	// const handleToggle = () => setIsChecked(isChecked ? false : true);
	// function handleToggleSwitchChange () {
	// 	console.log('aaa');
	// 	// setToggleSwitch(toggleSwitch ? false : true);
	// 	setToggleSwitch((prevToggleSwitch) => !prevToggleSwitch);
	// };
	const handleToggleSwitchChange =() => {
		console.log('aaa1')
		bool = !bool;
		console.log(bool)
		// setToggleSwitch((prevToggleSwitch) => !prevToggleSwitch);
	}

	return (
	  <Form>
		<div className="d-flex align-items-center">
		  <span className="me-2">{bool ? "On" : "Off"}</span>
		  <Form.Check
			type="switch"
			id="toggle-switch"
			label=""
			checked={bool}
			onChange={handleToggleSwitchChange}
		  />
		</div>
	  </Form>
	);
}

export default TwoFactorAuthSwitch;