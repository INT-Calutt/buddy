import React, { useState, useEffect, useRef } from 'react';
import TrashIcon from '../images/trash.svg';
import SendIcon from '../images/send.svg';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { setModel, setApiKey, answerPrompt, streamResponseFromOpenAI, chatHistory } from '../scripts/streaming2.js';

const Chat = () => {
	const inputEl = useRef<HTMLInputElement>();
	const textBoxEl = useRef<HTMLInputElement>();
	const [question, setQuestion] = useState('');
	const [questionHistory, setQuestionHistory] = useState([]);
	const [answer, setAnswer] = useState('');

	useEffect(() => {
		setModel('gpt-3.5-turbo');
		setApiKey('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');
	}, []);

	useEffect(() => {
		if (textBoxEl.current) {
			textBoxEl.current.scrollBy(0, 10);
		}
	}, [textBoxEl.current, answer]);

	useEffect(() => {
		if (textBoxEl.current) {
			textBoxEl.current.scrollBy(0, 10000);
		}
	}, [textBoxEl.current, question]);

	useEffect(() => {
		if (chatHistory.length > 0) {
			const qaObjs = chatHistory.filter((qaObj, index) => {
				if (chatHistory.length === index + 1) {
					return qaObj.role === 'user';
				}
				return qaObj.role === 'user' && chatHistory[index + 1].role === 'assistant';
			});
			let questions = qaObjs.map((qObj: { role: string; content: string }) => qObj.content).reverse();
			questions = [...new Set(questions)];
			const isEqual =
				questions.length === questionHistory.length &&
				questions.every((value: string, index: number) => value === questionHistory[index]);
			if (!isEqual) {
				setQuestionHistory(questions);
			}
		}
	}, [chatHistory, answer]);

	useEffect(() => {
		const keyDownEvent = (event) => {
			if (event.key === 'Enter') {
				event.preventDefault();
				handleSend();
			} else if (event.key === 'ArrowUp') {
				if (questionHistory.length === 0) {
					return;
				}
				if (inputEl.current.value === '') {
					inputEl.current.value = questionHistory[0];
					return;
				}
				let index = questionHistory.indexOf(inputEl.current.value);
				if (index === -1) {
					inputEl.current.value = questionHistory[0];
				} else if (index === questionHistory.length - 1) {
					//do nothing
				} else {
					inputEl.current.value = questionHistory[index + 1];
				}
			} else if (event.key === 'ArrowDown') {
				if (questionHistory.length === 0 || inputEl.current.value === '') {
					return;
				}
				let index = questionHistory.indexOf(inputEl.current.value);
				if (index === -1) {
					//do nothing
				} else if (index === 0) {
					inputEl.current.value = '';
				} else {
					inputEl.current.value = questionHistory[index - 1];
				}
			}
		};
		if (inputEl.current) {
			inputEl.current.addEventListener('keydown', keyDownEvent);
		}

		return () => {
			inputEl.current.removeEventListener('keydown', keyDownEvent);
		};
	}, [inputEl.current, questionHistory]);

	const handleSend = async () => {
		if (inputEl?.current && inputEl.current.value.length > 0) {
			setQuestion('');
			setAnswer('');
			const question = inputEl.current.value;
			setQuestion(question);
			inputEl.current.value = '';
			// const answer = await answerPrompt(question);
			// setAnswer(answer);
			streamResponseFromOpenAI(question, (res) => {
				setAnswer(res);
			});
		}
	};

	const renderQA = (): ReactJSXElement => {
		return chatHistory.map((qaObj: { role: string; content: string }, index: number) => {
			if (index === chatHistory.length - 1 || (qaObj.role === 'user' && index === chatHistory.length - 2)) {
				return;
			}
			// if (qaObj.content === question) {
			// 	return;
			// }
			return (
				<div
					key={qaObj.content + index.toString()}
					className={`renderqa chat__${qaObj.role === 'user' ? 'question' : 'answer'}`}
				>
					{qaObj.content}
				</div>
			);
		});
	};

	return (
		<div className="chat">
			<div className="chat__text-box" ref={textBoxEl}>
				{!question && !answer && (
					<div className="chat__placeholder">Hey, I'm your buddy - ask me anything!</div>
				)}
				{renderQA()}
				<div className="chat__question">{question}</div>
				{answer && <div className="chat__answer">{answer}</div>}
			</div>
			<div className="chat__prompt">
				<input type="text" className="chat__input" ref={inputEl} />
				<div className="chat__input-icon">
					<SendIcon onClick={handleSend} className="icon path--fill" />
				</div>
				<TrashIcon className="icon path--stroke" />
			</div>
		</div>
	);
};

export default Chat;
