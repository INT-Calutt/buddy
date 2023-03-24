import React from 'react';
import { createRoot } from 'react-dom/client';
import './contentScript.scss';
import App from '../components/App';

console.log('wiki!');

const body = document.querySelector('body');

const app = document.createElement('div');

app.id = 'buddy-root-23323';

if (body) {
	body.prepend(app);
}

const container = document.getElementById('buddy-root-23323');
const root = createRoot(container!);

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
