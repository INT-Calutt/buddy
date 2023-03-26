import React from 'react';
import { createRoot } from 'react-dom/client';
import './contentScript.scss';
import App from '../components/App';

const body = document.querySelector('body');

const app = document.createElement('div');
app.setAttribute('style', "all: unset;");

app.id = 'buddy-root-23323';

if (body) {
	body.prepend(app);
}

const container = document.getElementById('buddy-root-23323');

let y = document.getElementById("yadoyadoyado").innerHTML;
document.getElementById("yadoyadoyado").remove();
app.id = 'buddy-root-23324'; 

let shadowContainer = container.attachShadow({mode: "closed"});

const root = createRoot(shadowContainer);

root.render(
	<React.StrictMode>
		<div id='buddy-root-23323' style={{all:"unset"}}>
			<style>{y}</style>
			<App />
		</div>
	</React.StrictMode>
);
