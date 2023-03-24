import React, { useState, useEffect } from 'react';
import MainView from './MainView';
import Pane from './Pane';

const App = () => {
	const [show, setShow] = useState(false);

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

	return (
		<div
			className="buddy-app"
			style={show ? { opacity: 1, visibility: 'visible' } : { opacity: 0, visibility: 'hidden' }}
		>
			<Pane side="left" />
			<MainView />
			<Pane side="right" />
		</div>
	);
};

export default App;
