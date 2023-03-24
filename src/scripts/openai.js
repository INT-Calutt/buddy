const CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const MODELS_URL = 'https://api.openai.com/v1/models';
const OPENAI_API_KEY_STORAGE = 'OPENAI_API_KEY';
const OPENAI_MODEL_STORAGE = 'OPENAI_MODEL';

var SSE = function (url, options) {
	if (!(this instanceof SSE)) {
		return new SSE(url, options);
	}

	this.INITIALIZING = -1;
	this.CONNECTING = 0;
	this.OPEN = 1;
	this.CLOSED = 2;

	this.url = url;

	options = options || {};
	this.headers = options.headers || {};
	this.payload = options.payload !== undefined ? options.payload : '';
	this.method = options.method || (this.payload && 'POST') || 'GET';
	this.withCredentials = !!options.withCredentials;

	this.FIELD_SEPARATOR = ':';
	this.listeners = {};

	this.xhr = null;
	this.readyState = this.INITIALIZING;
	this.progress = 0;
	this.chunk = '';

	this.addEventListener = function (type, listener) {
		if (this.listeners[type] === undefined) {
			this.listeners[type] = [];
		}

		if (this.listeners[type].indexOf(listener) === -1) {
			this.listeners[type].push(listener);
		}
	};

	this.removeEventListener = function (type, listener) {
		if (this.listeners[type] === undefined) {
			return;
		}

		var filtered = [];
		this.listeners[type].forEach(function (element) {
			if (element !== listener) {
				filtered.push(element);
			}
		});
		if (filtered.length === 0) {
			delete this.listeners[type];
		} else {
			this.listeners[type] = filtered;
		}
	};

	this.dispatchEvent = function (e) {
		if (!e) {
			return true;
		}

		e.source = this;

		var onHandler = 'on' + e.type;
		if (this.hasOwnProperty(onHandler)) {
			this[onHandler].call(this, e);
			if (e.defaultPrevented) {
				return false;
			}
		}

		if (this.listeners[e.type]) {
			return this.listeners[e.type].every(function (callback) {
				callback(e);
				return !e.defaultPrevented;
			});
		}

		return true;
	};

	this._setReadyState = function (state) {
		var event = new CustomEvent('readystatechange');
		event.readyState = state;
		this.readyState = state;
		this.dispatchEvent(event);
	};

	this._onStreamFailure = function (e) {
		var event = new CustomEvent('error');
		event.data = e.currentTarget.response;
		this.dispatchEvent(event);
		this.close();
	};

	this._onStreamAbort = function (e) {
		this.dispatchEvent(new CustomEvent('abort'));
		this.close();
	};

	this._onStreamProgress = function (e) {
		if (!this.xhr) {
			return;
		}

		if (this.xhr.status !== 200) {
			this._onStreamFailure(e);
			return;
		}

		if (this.readyState == this.CONNECTING) {
			this.dispatchEvent(new CustomEvent('open'));
			this._setReadyState(this.OPEN);
		}

		var data = this.xhr.responseText.substring(this.progress);
		this.progress += data.length;
		data.split(/(\r\n|\r|\n){2}/g).forEach(
			function (part) {
				if (part.trim().length === 0) {
					this.dispatchEvent(this._parseEventChunk(this.chunk.trim()));
					this.chunk = '';
				} else {
					this.chunk += part;
				}
			}.bind(this)
		);
	};

	this._onStreamLoaded = function (e) {
		this._onStreamProgress(e);

		// Parse the last chunk.
		this.dispatchEvent(this._parseEventChunk(this.chunk));
		this.chunk = '';
	};

	/**
	 * Parse a received SSE event chunk into a constructed event object.
	 */
	this._parseEventChunk = function (chunk) {
		if (!chunk || chunk.length === 0) {
			return null;
		}

		var e = { id: null, retry: null, data: '', event: 'message' };
		chunk.split(/\n|\r\n|\r/).forEach(
			function (line) {
				line = line.trimRight();
				var index = line.indexOf(this.FIELD_SEPARATOR);
				if (index <= 0) {
					// Line was either empty, or started with a separator and is a comment.
					// Either way, ignore.
					return;
				}

				var field = line.substring(0, index);
				if (!(field in e)) {
					return;
				}

				var value = line.substring(index + 1).trimLeft();
				if (field === 'data') {
					e[field] += value;
				} else {
					e[field] = value;
				}
			}.bind(this)
		);

		var event = new CustomEvent(e.event);
		event.data = e.data;
		event.id = e.id;
		return event;
	};

	this._checkStreamClosed = function () {
		if (!this.xhr) {
			return;
		}

		if (this.xhr.readyState === XMLHttpRequest.DONE) {
			this._setReadyState(this.CLOSED);
		}
	};

	this.stream = function () {
		this._setReadyState(this.CONNECTING);

		this.xhr = new XMLHttpRequest();
		this.xhr.addEventListener('progress', this._onStreamProgress.bind(this));
		this.xhr.addEventListener('load', this._onStreamLoaded.bind(this));
		this.xhr.addEventListener('readystatechange', this._checkStreamClosed.bind(this));
		this.xhr.addEventListener('error', this._onStreamFailure.bind(this));
		this.xhr.addEventListener('abort', this._onStreamAbort.bind(this));
		this.xhr.open(this.method, this.url);
		for (var header in this.headers) {
			this.xhr.setRequestHeader(header, this.headers[header]);
		}
		this.xhr.withCredentials = this.withCredentials;
		this.xhr.send(this.payload);
	};

	this.close = function () {
		if (this.readyState === this.CLOSED) {
			return;
		}

		this.xhr.abort();
		this.xhr = null;
		this._setReadyState(this.CLOSED);
	};
};

// Export our SSE module for npm.js
if (typeof exports !== 'undefined') {
	exports.SSE = SSE;
}

export const chatHistory = [];

//for noam
export function setModel(model) {
	localStorage.setItem(OPENAI_MODEL_STORAGE, model);
}

//for noam
export function getModel() {
	return localStorage.getItem(OPENAI_MODEL_STORAGE);
	return 'gpt-3.5-turbo';
}

//for noam
export function setApiKey(api_key) {
	localStorage.setItem(OPENAI_API_KEY_STORAGE, api_key);
}

//for noam
export function getApiKey() {
	return localStorage.getItem(OPENAI_API_KEY_STORAGE);
	return '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';
}

function getHeaders(api_key) {
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${api_key}`,
	};
}

function turnToUserMessage(prompt) {
	return {
		role: 'user',
		content: prompt,
	};
}

async function _getAvailableModels(apiKey) {
	let response = await fetch(MODELS_URL, {
		method: 'GET',
		headers: getHeaders(apiKey),
	});

	let responseData = await response.json();

	return responseData['data'].map((v) => v['id']);
}

//for noam
export async function getAvailableModels() {
	apiKey = getApiKey();

	if (apiKey === null) {
		throw 'apikey needs to be set';
	}

	return await _getAvailableModels(apiKey);
}

async function _sendToOpenAIChatCompletionAndReturnChoiceMessage(apiKey, model, messages) {
	let response = await fetch(CHAT_URL, {
		method: 'POST',
		headers: getHeaders(apiKey),
		body: JSON.stringify({
			model: model,
			messages: messages,
		}),
	});

	let responseData = await response.json();

	return responseData['choices'][0]['message'];
}

async function answerSinglePrompt(prompt) {
	apiKey = getApiKey();
	model = getModel();

	if (apiKey === null || model === null) {
		throw 'apikey and model needs to be set';
	}

	let newMessage = turnToUserMessage(prompt);

	let responseMessage = await _sendToOpenAIChatCompletionAndReturnChoiceMessage(apiKey, model, [newMessage]);

	chatHistory.push(newMessage);
	chatHistory.push(responseMessage);

	return responseMessage['content'];
}

async function answerPromptWithContext(prompt, context) {
	apiKey = getApiKey();
	model = getModel();

	if (apiKey === null || model === null) {
		throw 'apikey and model needs to be set';
	}

	const messages = [turnToUserMessage(context), turnToUserMessage(prompt)];

	let responseMessage = await _sendToOpenAIChatCompletionAndReturnChoiceMessage(apiKey, model, messages);

	messages.forEach((m) => chatHistory.push(m));
	chatHistory.push(responseMessage);

	return responseMessage['content'];
}

async function answerPromptWithHistory(prompt) {
	apiKey = getApiKey();
	model = getModel();

	if (apiKey === null || model === null) {
		throw 'apikey and model needs to be set';
	}

	let promptMessage = turnToUserMessage(prompt);
	const messages = [...chatHistory, promptMessage];

	let responseMessage = await _sendToOpenAIChatCompletionAndReturnChoiceMessage(apiKey, model, messages);

	chatHistory.push(promptMessage);
	chatHistory.push(responseMessage);

	return responseMessage['content'];
}

//for noam
export async function answerPrompt(prompt, context = null, useHistory = true) {
	const apiKey = getApiKey();
	const model = getModel();

	if (apiKey === null || model === null) {
		throw 'apikey and model needs to be set';
	}

	let messages = [];

	if (useHistory) {
		messages = [...chatHistory];
	}

	let contextMessage = null;
	if (context && context !== null && context !== undefined && context !== '') {
		contextMessage = turnToUserMessage(context);
		messages.push(contextMessage);
	}

	let promptMessage = turnToUserMessage(prompt);
	messages.push(promptMessage);

	let responseMessage = await _sendToOpenAIChatCompletionAndReturnChoiceMessage(apiKey, model, messages);

	chatHistory.push(promptMessage);
	if (contextMessage !== null) chatHistory.push(contextMessage);
	chatHistory.push(responseMessage);

	return responseMessage['content'];
}

export async function streamResponseFromOpenAI(prompt, newContentCallback) {
	const api_key = getApiKey();
	let promptMessage = turnToUserMessage(prompt);
	const es = new SSE(CHAT_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${api_key}`,
		},
		payload: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: [promptMessage],
			stream: true,
		}),
		//pollingInterval: 25000,
		//witCredentials: true
	});

	let newContent = '';

	const sseListener = (event) => {
		if (event.type == 'open') {
			console.log('SSE Connection Open');
		} else if (event.type == 'message') {
			if (event.data == '[DONE]') {
				es.close();
			} else {
				const data = JSON.parse(event.data);
				//console.log(data);
				const delta = data['choices'][0]['delta'];
				const finishReason = data['choices'][0]['finish_reason'];

				if (finishReason == 'stop') {
					es.close();
				} else {
					if (delta && delta['content']) {
						newContent = newContent + delta['content'];
						//document.getElementById('m_Answer').innerHTML = newContent
						newContentCallback(newContent);
					}
				}
			}
		} else if (event.type == 'error') {
			console.log(`Connection Error: ${event.message}`);
		} else if (event.type == 'exception') {
			console.log(`Error: ${event.message}, ${event.error}`);
		}
	};

	es.addEventListener('open', sseListener);
	es.addEventListener('message', sseListener);
	es.addEventListener('error', sseListener);

	es.stream();
}
