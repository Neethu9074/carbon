import * as time from '../timeCalculations';
import {setupStates} from './States/index';
import AStateMachine from '../StateMachine/AStateMachine';


/*eslint-disable no-multi-spaces*/
const stateLUT = [
  //active  resulting state
  [[true],  'initial'],
  [[false], 'inactive']
];
/*eslint-enable no-multi-spaces*/

class StateMachine extends AStateMachine {

  constructor(states) {
    super({
      states,
      stateProperties: { active: true },
      stateLUT});
  }

  checkAgainstCurrentProperties(flags) {
    if(this.stateProperties.active === flags[0]) {
      return true;
    }
    return false;
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
