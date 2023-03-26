import React, { useState, useEffect } from 'react';
import LeftPane from './LeftPane';
import MainView from './MainView';
import RightPane from './RightPane';
import { getAvailableModels, getModel, setModel, getApiKey, setApiKey as setApiKeyInStorage } from '../scripts/openai';

function makeDraggable(draggable, handle, ignore) {
	var posX = 0,
		posY = 0,
		mouseX = 0,
		mouseY = 0;

	handle.addEventListener('mousedown', function (e) {
		if (e.target === ignore) {
			return;
		}
		e.preventDefault();
		posX = e.clientX - draggable.offsetLeft;
		posY = e.clientY - draggable.offsetTop;
		document.addEventListener('mousemove', mousemove);
		document.addEventListener('mouseup', mouseup);
	});

	function mousemove(e) {
		mouseX = e.clientX - posX;
		mouseY = e.clientY - posY;
		draggable.style.left = mouseX + 'px';
		draggable.style.top = mouseY + 'px';
	}

	function mouseup() {
		document.removeEventListener('mousemove', mousemove);
		document.removeEventListener('mouseup', mouseup);
	}
}

const App = () => {
	const [show, setShow] = useState(false);
	const [leftPaneOpen, setLeftPaneOpen] = useState(false);
	const [rightPaneOpen, setRightPaneOpen] = useState(true);
	const [insertApiKey, setInsertApiKey] = useState(true);
	const [apiKey, setApiKey] = useState('');

	useEffect(() => {
		const draggableDiv = document.querySelector('.buddy-app');
		const handleDiv = document.querySelector('.buddy-app .header');
		const ignoreDiv = document.querySelector('.buddy-app .header select');
		makeDraggable(draggableDiv, handleDiv, ignoreDiv);
	}, []);

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
			if (universalCtrlPressed && (event.key === 'm' || event.key === 'M')) {
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
