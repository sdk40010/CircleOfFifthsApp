'use sctirc';

import CircleOfFifths from './CircleOfFifths.js';

export class App {
  constructor() {
    this.circleOfFifths = new CircleOfFifths();
  }

  mount() {
    this.circleOfFifths.init();
  }
}