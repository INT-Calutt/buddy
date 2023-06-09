import React, { useState, useEffect } from 'react';
import CodeIcon from '../images/code.svg';
import HistoryIcon from '../images/history.svg';
import ConfigurationIcon from '../images/configuration.svg';
import IncognitoIcon from '../images/incognito.svg';
import SunIcon from '../images/sun.svg';
import PlaygroundIcon from '../images/playground.svg';
import { Form } from 'react-bootstrap';

const Header = ({ rpo, lpo, onPaneClick, preset, onPresetChange }) => {
	const [activeIcons, setActiveIcons] = useState([]);

	const handleIconClicked = (name: string) => {
		if (activeIcons.includes(name)) {
			setActiveIcons(activeIcons.filter((iconName) => iconName !== name));
		} else {
			setActiveIcons([...activeIcons, name]);
		}
	};
	return (
		<div className="header">
			<div className="header--left">
				<HistoryIcon
					className={`icon path--fill${lpo ? ' icon--active' : ''}`}
					onClick={() => onPaneClick('left')}
				/>
				<IncognitoIcon
					className={`icon g--fill${activeIcons.includes('incognito') ? ' icon--active' : ''}`}
					onClick={() => handleIconClicked('incognito')}
				/>
				<PlaygroundIcon
					className={`icon svg--fill${activeIcons.includes('playground') ? ' icon--active' : ''}`}
					onClick={() => handleIconClicked('playground')}
				/>
			</div>
			<div className="header--center">
				<Form.Select
					bsPrefix="buddy-bs-select"
					className="select-preset"
					size="lg"
					value={preset}
					onChange={(e) => {
						onPresetChange(e.target.value);
					}}
				>
					<option value="">Load a preset...</option>
					<option value="rewrite the following in a casual tone:">
						rewrite the following in a casual tone:
					</option>
					<option value="rewrite the following in a professional tone:">
						rewrite the following in a professional tone:
					</option>
					<option value="rewrite the following in a correct grammar:">
						rewrite the following in a correct grammar:
					</option>
				</Form.Select>
			</div>
			<div className="header--right">
				<CodeIcon
					className={`icon svg--fill${activeIcons.includes('code') ? ' icon--active' : ''}`}
					onClick={() => handleIconClicked('code')}
				/>
				<SunIcon
					className={`icon path--fill${activeIcons.includes('sun') ? ' icon--active' : ''}`}
					onClick={() => handleIconClicked('sun')}
				/>
				<ConfigurationIcon
					className={`icon path--fill path--stroke${rpo ? ' icon--active' : ''}`}
					onClick={() => onPaneClick('right')}
				/>
			</div>
		</div>
	);
};

export default Header;
