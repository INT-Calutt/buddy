import React, { useState, useEffect, useRef } from 'react';
import TrashIcon from '../images/trash.svg';
import SendIcon from '../images/send.svg';
import {
	setModel,
	setApiKey,
	answerPrompt,
	streamResponseFromOpenAI,
	chatHistory,
	clearChatHistory,
	convertOpenAIAPIAnswerToCodeTags,
} from '../scripts/openai.js';
import hljs from 'highlight.js';
import { Form } from 'react-bootstrap';

const Chat = ({ insertApiKey }) => {
	const inputEl = useRef<HTMLInputElement>();
	const textBoxEl = useRef<HTMLInputElement>();
	const [question, setQuestion] = useState('');
	const [questionHistory, setQuestionHistory] = useState([]);
	const [answer, setAnswer] = useState('');
	const [stopResponse, setStopResponse] = useState<Function>();

	// useEffect(() => {
	// 	if (answer) {
	// 		document.querySelector('.chat__answer.current').innerHTML = convertOpenAIAPIAnswerToCodeTags(answer);
	// 		hljs.highlightAll();
	// 	}
	// }, [answer]);

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
		if (chatHistory.length >= 0) {
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
		const keyDownEvent = (event: KeyboardEvent) => {
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
			let stopResponse = streamResponseFromOpenAI(question, (res) => {
				setAnswer(res);
			});
			setStopResponse(() => {
				return stopResponse;
			});
		}
	};

	const renderQA = () => {
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

	const renderTextBox = () => {
		if (insertApiKey) {
			//add: || noApiKey
			return (
				<div className="chat__enter-key">
					<Form.Control
						type="text"
						bsPrefix="buddy-bs-control"
						placeholder="Enter your OpenAI's API key"
					></Form.Control>
					<button className="chat__button">Use this key</button>
				</div>
			);
		} else {
			return (
				<>
					{!question && !answer && (
						<div className="chat__placeholder">Hey, I'm your buddy - ask me anything!</div>
					)}
					{renderQA()}
					<div className="chat__question">{question}</div>
					{answer && <div className="chat__answer current">{answer}</div>}
				</>
			);
		}
	};

	return (
		<div className="chat">
			<div className="chat__text-box" ref={textBoxEl}>
				{renderTextBox()}
			</div>
			{answer && (
				<button
					className="chat__button"
					onClick={() => {
						try {
							console.log('Stopping');
							stopResponse();
						} catch (e) {}
					}}
				>
					Stop response
				</button>
			)}
			<div className="chat__prompt">
				<input type="text" className="chat__input" ref={inputEl} />
				<div className="chat__input-icon">
					<SendIcon onClick={handleSend} className="icon path--fill" />
				</div>
				<TrashIcon
					className="icon path--stroke"
					onClick={() => {
						clearChatHistory();
						setQuestion('');
						setAnswer('');
					}}
				/>
			</div>
		</div>
	);
};

export default Chat;
