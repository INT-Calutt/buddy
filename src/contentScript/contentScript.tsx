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
const shadowRoot = container.attachShadow({ mode: 'open' });

const root = createRoot(shadowRoot);

root.render(
	<React.StrictMode>
		<style>{'.buddy-app { background: red }'}</style>
		<App />
	</React.StrictMode>
);
