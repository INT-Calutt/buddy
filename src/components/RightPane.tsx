import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { getAvailableModels, setModel, setApiKey, getApiKey } from '../scripts/openai';

const RightPane = ({ onApiKeyEdit, apiKey, onPaneClick, style = null }) => {
	const [models, setModels] = useState([]);

	const apiKeyEl = useRef<HTMLInputElement>();

	// useEffect(() => {
	// 	getApiKey().then((apiKey) => {
	// 		if (apiKey) {
	// 			setApiKeyLocal(apiKey);
	// 		}
	// 	});
	// }, [apiKeyEl.current]);

	// useEffect(() => {
	// 	const asyncFunc = async () => {
	// 		let availModels = await getAvailableModels();
	// 		if (availModels.length > 0) {
	// 			setModel('gpt-3.5-turbo');
	// 		}
	// 		setModels(availModels);
	// 	};

	// 	asyncFunc();
	// }, []);
	// const [valueTemp, setValueTemp] = useState('0.7');
	// const [valueMaxLen, setValueMaxLen] = useState('256');
	// const [valueTopP, setValueTopP] = useState('1');
	// const [valueFreqPen, setValueFreqPen] = useState('0');
	// const [valuePresPen, setValuePresPen] = useState('0');
	// const [valueBestOf, setValueBestOf] = useState('1');

	return (
		<div className="pane pane--right" onClick={onPaneClick} style={style}>
			<Form>
				<Form.Group className="buddy-bs-group mb-3">
					<Form.Label bsPrefix="buddy-bs-label">Service provider</Form.Label>
					<Form.Select bsPrefix="buddy-bs-select">
						<option>OpenAI</option>
					</Form.Select>
				</Form.Group>
				<Form.Group className="buddy-bs-group mb-3">
					<div className="buddy-bs-label--wrapper">
						<Form.Label bsPrefix="buddy-bs-label">API key</Form.Label>
						<span className="buddy-bs-label--value" onClick={onApiKeyEdit}>
							edit
						</span>
					</div>
					<Form.Control
						type="text"
						bsPrefix="buddy-bs-control"
						placeholder="Enter your API Key"
						value={apiKey}
						disabled
					></Form.Control>
				</Form.Group>
				<Form.Group className="buddy-bs-group mb-3">
					<Form.Label bsPrefix="buddy-bs-label">Mode</Form.Label>
					<Form.Select bsPrefix="buddy-bs-select">
						<option>Complete</option>
					</Form.Select>
				</Form.Group>
				<Form.Group className="buddy-bs-group mb-3">
					<Form.Label bsPrefix="buddy-bs-label">Model</Form.Label>
					<Form.Select
						bsPrefix="buddy-bs-select"
						// onChange={(e) => {
						// 	setModel(e.target.value);
						// }}
					>
						<option>gpt-3.5-turbo</option>
						{/* {models.map((model: string) => {
							return (
								<option key={model} value={model}>
									{model}
								</option>
							);
						})} */}
					</Form.Select>
				</Form.Group>
				{/* <Form.Group className="buddy-bs-group mb-2_5">
					<div className="buddy-bs-range--wrapper">
						<Form.Label bsPrefix="buddy-bs-label">Temperature</Form.Label>
						<span className="buddy-bs-range--value">{valueTemp}</span>
					</div>
					<Form.Range
						bsPrefix="buddy-bs-range"
						min={0}
						max={1}
						step={0.01}
						defaultValue={valueTemp}
						onChange={(e) => {
							setValueTemp(e.target.value);
						}}
					/>
				</Form.Group>
				<Form.Group className="buddy-bs-group mb-2_5">
					<div className="buddy-bs-range--wrapper">
						<Form.Label bsPrefix="buddy-bs-label">Maximum length</Form.Label>
						<span className="buddy-bs-range--value">{valueMaxLen}</span>
					</div>
					<Form.Range
						bsPrefix="buddy-bs-range"
						min={1}
						max={4000}
						step={1}
						defaultValue={valueMaxLen}
						onChange={(e) => {
							setValueMaxLen(e.target.value);
						}}
					/>
				</Form.Group>
				<Form.Group className="buddy-bs-group mb-2_5">
					<div className="buddy-bs-range--wrapper">
						<Form.Label bsPrefix="buddy-bs-label">Top P</Form.Label>
						<span className="buddy-bs-range--value">{valueTopP}</span>
					</div>
					<Form.Range
						bsPrefix="buddy-bs-range"
						min={0}
						max={1}
						step={0.01}
						defaultValue={valueTopP}
						onChange={(e) => {
							setValueTopP(e.target.value);
						}}
					/>
				</Form.Group>
				<Form.Group className="buddy-bs-group mb-2_5">
					<div className="buddy-bs-range--wrapper">
						<Form.Label bsPrefix="buddy-bs-label">Frequency penalty</Form.Label>
						<span className="buddy-bs-range--value">{valueFreqPen}</span>
					</div>
					<Form.Range
						bsPrefix="buddy-bs-range"
						min={0}
						max={2}
						step={0.01}
						defaultValue={valueFreqPen}
						onChange={(e) => {
							setValueFreqPen(e.target.value);
						}}
					/>
				</Form.Group>
				<Form.Group className="buddy-bs-group mb-2_5">
					<div className="buddy-bs-range--wrapper">
						<Form.Label bsPrefix="buddy-bs-label">Presence penalty</Form.Label>
						<span className="buddy-bs-range--value">{valuePresPen}</span>
					</div>
					<Form.Range
						bsPrefix="buddy-bs-range"
						min={0}
						max={2}
						step={0.01}
						defaultValue={valuePresPen}
						onChange={(e) => {
							setValuePresPen(e.target.value);
						}}
					/>
				</Form.Group>
				<Form.Group className="buddy-bs-group mb-2_5">
					<div className="buddy-bs-range--wrapper">
						<Form.Label bsPrefix="buddy-bs-label">Best of</Form.Label>
						<span className="buddy-bs-range--value">{valueBestOf}</span>
					</div>
					<Form.Range
						bsPrefix="buddy-bs-range"
						min={1}
						max={20}
						step={1}
						defaultValue={valueBestOf}
						onChange={(e) => {
							setValueBestOf(e.target.value);
						}}
					/>
				</Form.Group> */}
			</Form>
		</div>
	);
};

export default RightPane;
