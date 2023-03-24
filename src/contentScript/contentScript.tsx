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

//  const hostElement = document.getElementById('host-element');
// 	const childElement = document.createElement('p');
//  const shadowRoot = hostElement.attachShadow({ mode: 'open' });
// 	childElement.textContent = 'This is a paragraph inside the shadow DOM!';
// 	shadowRoot.appendChild(childElement);
