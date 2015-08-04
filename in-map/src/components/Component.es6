'use strict';

// import THREE from 'three';
import * as time from '../timeCalculations';
import {setupStates} from './States/index';


/*eslint-disable no-multi-spaces*/
const stateLUT = [
  //active  resulting state
  [[true],  'initial'],
  [[false], 'inactive']
];
/*eslint-enable no-multi-spaces*/

class StateMachine {
  constructor(states) {
    this.stateLookUpTable = stateLUT;
    this.states = states;
    this.stateProperties = {
      active: true
    };
    this.state = this.states.initial;
  }

  getStateFromLut({active, states}) {
    for (let i = 0; i < stateLUT.length; i++) {
      const entry = stateLUT[i];
      if(active === entry[0][0]) {
        return states[entry[1]];
      }
    }
  }

  changeStateProperty(name, value) {
    if(this.stateProperties[name] !== value) {
      this.stateProperties[name] = value;
      this.updateState();
    }
  }

  updateState() {
    const props = this.stateProperties;
    const oldState = this.state;
    const newState = this.getStateFromLut({
      active: props.active,
      states: this.states
    });

    if(oldState !== newState) {
      oldState.leave();
      this.state = newState;
      newState.enter();
    }
  }
}

export default class Component {
  constructor(sceneObject) {
    this.sceneObject = sceneObject;
    this.stateMachine = new StateMachine(setupStates(this));

    time.addTimeEventListener(this);
    this.needsUpdate = false;
  }

  initialized() {
    this.stateMachine.state.enter();
  }

  onInitialEnter() {}
  onInitialLeave() {}
  onInactiveEnter() {}
  onInactiveLeave() {}

  isActive() {
    return this.stateMachine.stateProperties.active;
  }

  handleTimeEvent60Fps() {}

  handleTimeEvent30Fps() {
    if(this.needsUpdate) {
      this.update30Fps();
    }
  }

  update60Fps() {}

  update30Fps() {}

  dispose() {
    time.removeTimeEventListener(this);
  }
}
