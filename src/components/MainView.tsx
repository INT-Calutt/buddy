import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import Header from './Header';

const MainView = ({ lpo, rpo, onPaneClick, insertApiKey, onUseKey }) => {
	const [preset, setPreset] = useState('');

	return (
		<div className="main-view">
			<Header
				lpo={lpo}
				rpo={rpo}
				onPaneClick={onPaneClick}
				preset={preset}
				onPresetChange={(p) => setPreset(p)}
			/>
			<Chat insertApiKey={insertApiKey} onUseKey={onUseKey} />
		</div>
	);
};

export default MainView;
