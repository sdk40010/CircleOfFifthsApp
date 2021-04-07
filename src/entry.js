'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ResultArea from './ResultArea';
import handleScaleMode from './scaleMode';
import handleDim7Mode from './dim7Mode';
import { CircleOfFifths } from './CircleOfFifths.js';

function mount() {
  const color = {
    main: 0xE0E0E0,
    light: 0xF5F5F5,
    black: 0x333333,
    white: 0xFFFFFF
  };

  const circleOfFifths = new CircleOfFifths({
    color,
    mode: 'スケール',
    modeListeners: new Map([
      ['スケール', handleScaleMode],
      // ['dim7', handleDim7Mode]
    ])
  });
  ReactDOM.render(
    <ResultArea circleOfFifths={circleOfFifths} color={color} />,
    document.getElementById('result-container')
  );
  circleOfFifths.init();
}

mount();


