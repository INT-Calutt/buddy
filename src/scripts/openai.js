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

const CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const MODELS_URL = 'https://api.openai.com/v1/models';
const OPENAI_API_KEY_STORAGE = 'OPENAI_API_KEY';
const OPENAI_MODEL_STORAGE = 'OPENAI_MODEL';

export let chatHistory = [];

export function clearChatHistory() {
	// while (chatHistory.length > 0) {
	// 	chatHistory.pop();
	// }
	chatHistory = [];
}

export async function setModel(model) {
	let p = new Promise((resolve, reject) => {
		let port = chrome.runtime.connect();
		port.onMessage.addListener((apiKey) => {
			resolve(apiKey);
		});
		port.postMessage({
			'type': 'set',
			'key': OPENAI_MODEL_STORAGE,
			'value': model
		})
	})
	return await p;
}

export async function getModel() {
	let p = new Promise((resolve, reject) => {
		let port = chrome.runtime.connect();
		port.onMessage.addListener((apiKey) => {
			resolve(apiKey);
		});
		port.postMessage({
			'type': 'get',
			'key': OPENAI_MODEL_STORAGE
		})
	})
	return await p;
}

export async function setApiKey(api_key) {
	let p = new Promise((resolve, reject) => {
		let port = chrome.runtime.connect();
		port.onMessage.addListener((apiKey) => {
			resolve(apiKey);
		});
		port.postMessage({
			'type': 'set',
			'key': OPENAI_API_KEY_STORAGE,
			'value': api_key
		})
	})
	return await p;
}

export async function getApiKey() {
	let p = new Promise((resolve, reject) => {
		let port = chrome.runtime.connect();
		port.onMessage.addListener((apiKey) => {
			resolve(apiKey);
		});
		port.postMessage({
			'type': 'get',
			'key': OPENAI_API_KEY_STORAGE
		})
	})
	return await p;
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

const supportedModels = ['gpt-4', 'gpt-4-32k', 'gpt-3.5-turbo', 'text-davinci-003', 'code-davinci-002'];
async function _getAvailableModels(apiKey) {
	let response = await fetch(MODELS_URL, {
		method: 'GET',
		headers: getHeaders(apiKey),
	});

	let responseData = await response.json();

	return responseData['data'].map((v) => v['id']).filter((v) => supportedModels.includes(v));
}

export async function getAvailableModels() {
	let apiKey = getApiKey();

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

export async function answerPrompt(prompt, context = null, useHistory = true) {
	let apiKey = getApiKey();
	let model = getModel();

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

export function streamResponseFromOpenAI(
	prompt,
	newContentCallback = (r) => {},
	context = null,
	useHistory = true,
	newPartialContentCallback = null
) {
	let apiKey = getApiKey();
	let model = getModel();

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
		chatHistory.push(contextMessage);
	}

	let promptMessage = turnToUserMessage(prompt);
	messages.push(promptMessage);
	chatHistory.push(promptMessage);

	const es = new SSE(CHAT_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		payload: JSON.stringify({
			model: model,
			messages: messages,
			stream: true,
		}),
	});

	let newContent = '';

	const sseListener = (event) => {
		if (event.data == '[DONE]') {
			es.close();
			chatHistory.push({
				role: 'assistant',
				content: newContent,
			});
		} else {
			const data = JSON.parse(event.data);
			const delta = data['choices'][0]['delta'];
			const finishReason = data['choices'][0]['finish_reason'];

			if (finishReason == 'stop') {
				es.close();
			} else {
				if (delta && delta['content']) {
					newContent = newContent + delta['content'];
					newContentCallback(newContent);

					if (newPartialContentCallback !== null) newPartialContentCallback(delta['content']);
				}
			}
		}
	};

	es.addEventListener('message', sseListener);
	es.stream();

	return () => {
		es.removeEventListener('message', sseListener);
		es.close();
	};
}

function gpt_convertOpenAIAPIAnswerToCodeTags(answer) {
	answer = gpt_replaceCodeTags(answer, '```', '<pre><code>', '</code></pre');
	answer = gpt_replaceCodeTags(answer, '`', '<code>', '</code>');
	return answer;
}

function gpt_replaceCodeTags(answer, codeTag, openTag, closeTag) {
	const regex = new RegExp(codeTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
	let isOpening = true;
	return answer.replace(regex, (match) => {
		const tag = isOpening ? openTag : closeTag;
		isOpening = !isOpening;
		return tag;
	});
}

export function convertOpenAIAPIAnswerToCodeTags(answer) {
	let index = answer.indexOf('```');
	let openning = true;

	while (index !== -1) {
		let elementToReplaceWith = openning ? '<pre><code>' : '</code></pre>';
		openning = !openning;

		answer = answer.replace('```', elementToReplaceWith);

		index = answer.indexOf('```', index);
	}

	index = answer.indexOf('`');
	openning = true;

	while (index !== -1) {
		let elementToReplaceWith = openning ? '<code>' : '</code>';
		openning = !openning;

		answer = answer.replace('`', elementToReplaceWith);

		index = answer.indexOf('`', index);
	}

	return answer;
}

export async function reAskQuestion(stream, answerCallback = (r) => {}) {
	let prompt = null;
	let context = null;
	let useHistory = document.getElementById('m_UseHistory').checked;

	let last = chatHistory.pop();
	while (last['role'] === 'assistant') last = chatHistory.pop();

	prompt = last['content'];

	last = chatHistory[chatHistory.length - 1];
	if (last['role'] == 'user') {
		context = chatHistory.pop()['content'];
	}

	if (stream == false) {
		let answer = await answerPrompt(prompt, context, useHistory);
		answerCallback(answer);
		return answer;
	} else {
		return (_stopCurrentQuestion = streamResponseFromOpenAI(prompt, answerCallback, context, useHistory));
	}
}
