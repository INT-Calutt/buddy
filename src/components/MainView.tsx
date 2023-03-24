import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import Header from './Header';

const MainView = () => {
	return (
		<div className="main-view">
			<Header />
			<Chat />
		</div>
	);
};

export default MainView;
