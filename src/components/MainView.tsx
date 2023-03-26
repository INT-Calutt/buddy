import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import Header from './Header';

const MainView = ({ lpo, rpo, onPaneClick, insertApiKey }) => {
	return (
		<div className="main-view">
			<Header lpo={lpo} rpo={rpo} onPaneClick={onPaneClick} />
			<Chat insertApiKey={insertApiKey} />
		</div>
	);
};

export default MainView;
