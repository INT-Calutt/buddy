import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.scss';

const test = <img src="icon.png" />;

const entry = document.createElement('div');
entry.id = 'entry';
document.body.appendChild(entry);
const root = createRoot(document.getElementById('entry'));
root.render(test);
