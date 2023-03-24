import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

const RightPane = ({ onPaneClick, style = null }) => {
	const [valueTemp, setValueTemp] = useState('0.7');
	const [valueMaxLen, setValueMaxLen] = useState('256');
	const [valueTopP, setValueTopP] = useState('1');
	const [valueFreqPen, setValueFreqPen] = useState('0');
	const [valuePresPen, setValuePresPen] = useState('0');
	const [valueBestOf, setValueBestOf] = useState('1');

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
					<Form.Label bsPrefix="buddy-bs-label">API Key</Form.Label>
					<Form.Control
						type="text"
						bsPrefix="buddy-bs-control"
						placeholder="Enter your API Key"
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
					<Form.Select bsPrefix="buddy-bs-select">
						<option>test-davinci-003</option>
					</Form.Select>
				</Form.Group>
				<Form.Group className="buddy-bs-group mb-2_5">
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
				</Form.Group>
			</Form>
		</div>
	);
};

export default RightPane;
