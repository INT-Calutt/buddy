import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import Header from './Header';

const MainView = ({ lpo, rpo, onPaneClick, insertApiKey, onUseKey }) => {
	return (
		<div className="main-view">
			<Header lpo={lpo} rpo={rpo} onPaneClick={onPaneClick} />
			<Chat insertApiKey={insertApiKey} onUseKey={onUseKey} />
		</div>
	);
};

export default MainView;
