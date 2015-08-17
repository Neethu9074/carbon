import * as time from '../timeCalculations';
import StateMachine from '../StateMachine/StateMachine';


export default class Component {

  constructor(sceneObject) {
    this.stateMachine = new StateMachine(this);
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
