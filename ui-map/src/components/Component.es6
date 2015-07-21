'use strict';

// import THREE from 'three';
import {setupStates} from './States/index';

const stateLUT = {
/*eslint-disable no-multi-spaces*/
  lut: [
    //active  resulting state
    [[true],  'inactive'],
    [[false], 'initial']
  ]
/*eslint-enable no-multi-spaces*/
};

class StateMachine {
  constructor(states) {
    this.stateLookUpTable = stateLUT;
    this.states = states;
    this.stateProperties = {
      active: true
    };
    this.state = this.states.initial;
    this.state.enter();
  }

  getStateFromLut({active, states}) {
    for (let i = 0; i < this.lut.length; i++) {
      const entry = this.lut[i];
      if(active === entry[0][0]) {
        const match = entry[1];
        let state;
        switch (match) {
          case 'inactive':
            state = states.inactive;
            break;
          case 'initial':
            state = states.initial;
            break;
        }
        return state;
      }
    }
  }
}

export default class Component {
  constructor() {
    this.stateMachine = new StateMachine(setupStates(this));
  }

  changeStateProperty(name, value) {
    if(this.stateProperties[name] !== value) {
      this.stateProperties[name] = value;
      this.updateState();
    }
  }
}
