import React, { useState, useEffect } from 'react';
import LeftPane from './LeftPane';
import MainView from './MainView';
import RightPane from './RightPane';
import { getAvailableModels, getModel, setModel, getApiKey, setApiKey as setApiKeyInStorage } from '../scripts/openai';

const App = () => {
	const [show, setShow] = useState(false);
	const [leftPaneOpen, setLeftPaneOpen] = useState(false);
	const [rightPaneOpen, setRightPaneOpen] = useState(true);
	const [insertApiKey, setInsertApiKey] = useState(true);
	const [apiKey, setApiKey] = useState('');

	useEffect(() => {
		getApiKey().then((apiKey) => {
			if (apiKey) {
				setApiKey(apiKey);
				setInsertApiKey(false);
			}
		});
	}, []);

	useEffect(() => {
		const shortcut = (event: KeyboardEvent) => {
			let universalCtrlPressed = false;
			if (navigator.userAgent.indexOf('Mac') !== -1) {
				universalCtrlPressed = event.metaKey;
			} else {
				universalCtrlPressed = event.ctrlKey;
			}
			if (universalCtrlPressed && (event.key === 'b' || event.key === 'B')) {
				setShow(!show);
			}
		};
		const input: HTMLInputElement = document.querySelector('#buddy-root-23323 .chat__input');
		if (input) input.focus();

		document.addEventListener('keydown', shortcut);
		return () => {
			document.removeEventListener('keydown', shortcut);
		};
	}, [show]);

	const handlePaneClick = (side) => {
		if (side === 'left') {
			//not ready yet
			// setLeftPaneOpen(!leftPaneOpen);
		} else {
			setRightPaneOpen(!rightPaneOpen);
		}
	};

	const handleApiKeyEdit = () => {
		setInsertApiKey(!insertApiKey);
	};

	const handleUseKey = (apiKeyValue) => {
		setApiKeyInStorage(apiKeyValue);
		setApiKey(apiKeyValue);
		setInsertApiKey(false);
	};

	return (
		<>
			<div
				className="buddy-app"
				style={show ? { opacity: 1, visibility: 'visible' } : { opacity: 0, visibility: 'hidden' }}
			>
				<LeftPane
					style={leftPaneOpen ? { opacity: 1 } : { opacity: 0 }}
					onPaneClick={() => {
						if (!leftPaneOpen) setShow(false);
					}}
				/>
				<MainView
					lpo={leftPaneOpen}
					rpo={rightPaneOpen}
					onPaneClick={handlePaneClick}
					insertApiKey={insertApiKey}
					onUseKey={handleUseKey}
				/>
				<RightPane
					style={rightPaneOpen ? { opacity: 1 } : { opacity: 0 }}
					onPaneClick={() => {
						if (!rightPaneOpen) setShow(false);
					}}
					onApiKeyEdit={handleApiKeyEdit}
					apiKey={apiKey}
				/>
			</div>
			<div
				className="buddy-overlay"
				onClick={() => {
					setShow(false);
				}}
				style={show ? { display: 'block' } : { display: 'none' }}
			/>
		</>
	);
};

export default App;
