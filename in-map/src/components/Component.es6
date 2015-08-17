import * as time from '../timeCalculations';
import AStateMachine from '../StateMachine/AStateMachine';

import InactiveState from '../StateMachine/InactiveState';
import InitialState from '../StateMachine/InitialState';


/*eslint-disable no-multi-spaces*/
const stateLUT = [
  //active  resulting state
  [[true],  'initial'],
  [[false], 'inactive']
];
/*eslint-enable no-multi-spaces*/

class StateMachine extends AStateMachine {

  constructor(owner) {
    super({
      stateProperties: { active: true },
      stateLUT,
      owner
    });
  }

  setupStates(owner) {
    return {
      initial: new InitialState(owner),
      inactive: new InactiveState(owner)
    };
  }


  checkAgainstCurrentProperties(flags) {
    if(this.stateProperties.active === flags[0]) {
      return true;
    }
    return false;
  }
}

export default class Component {

  constructor(sceneObject, StateMachineClass=StateMachine) {
    this.stateMachine = new StateMachineClass(this);
    this.sceneObject = sceneObject;
    this.needsUpdate = false;

    time.addTimeEventListener(this);
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

  handleComponentTimeEvent() {
    if(this.needsUpdate) {
      this.update();
      this.sceneObject.scene.renderScene();
    }
  }

  update() {}

  dispose() {
    this.needsUpdate = false;
    time.removeTimeEventListener(this);

    this.stateMachine.changeStateProperty('active', false);
  }
}
