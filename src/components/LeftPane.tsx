import React, { useState, useEffect } from 'react';

const LeftPane = ({ onPaneClick, style = null }) => {
	return (
		<div className="pane pane--left" onClick={onPaneClick} style={style}>
			Left Pane
		</div>
	);
};

export default LeftPane;
