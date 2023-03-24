import React, { useState, useEffect } from 'react';
import MainView from './MainView';
import Pane from './Pane';

const App = () => {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const shortcut = (event) => {
			if (event.ctrlKey && (event.key === 'b' || event.key === 'B')) {
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
			className="app"
			style={show ? { opacity: 1, visibility: 'visible' } : { opacity: 0, visibility: 'hidden' }}
		>
			<Pane side="left" />
			<MainView />
			<Pane side="right" />
		</div>
	);
};

export default App;
