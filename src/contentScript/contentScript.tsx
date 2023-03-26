import React from 'react';
import { createRoot } from 'react-dom/client';
import './contentScript.scss';
import App from '../components/App';

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
		<link
			rel="stylesheet"
			href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.7.0/build/styles/default.min.css"
		></link>
		<App />
	</React.StrictMode>
);

//  const hostElement = document.getElementById('host-element');
// 	const childElement = document.createElement('p');
//  const shadowRoot = hostElement.attachShadow({ mode: 'open' });
// 	childElement.textContent = 'This is a paragraph inside the shadow DOM!';
// 	shadowRoot.appendChild(childElement);
