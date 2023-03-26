import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.scss';

const popupIcon = <img src="popup-icon.png" />;

const entry = document.createElement('div');
entry.onclick = () => {
	window.open('https://github.com/INT-Calutt/buddy', '_blank');
};
entry.id = 'entry';
document.body.appendChild(entry);
const root = createRoot(document.getElementById('entry'));
root.render(popupIcon);
