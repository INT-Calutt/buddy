import React, { useState, useEffect } from 'react';

const Pane = ({ side }) => {
	return <div className={`pane pane--${side}`}>waka--{side}</div>;
};

export default Pane;
