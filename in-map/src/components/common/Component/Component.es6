import {StateMachine, PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import * as time from 'in-map/src/timeCalculations';

let idCounter = 0;

export default class Component {

  constructor(sceneObject, postId) {
    this.id = sceneObject.id + postId + '_' + idCounter++;
    this.stateMachine = new StateMachine(this);
    this.sceneObject = sceneObject;
    this.needsUpdate = false;

    this.timeEvent = time.addTimeEventListener(this.handleComponentTimeEvent.bind(this));
  }

  initialized() {
    this.stateMachine.initialized();
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }


  onInactiveEnter() {}
  onInactiveLeave() {}
  onInitialEnter() {}
  onInitialLeave() {}
  onHighlightEnter() {}
  onHighlightLeave() {}
  onSelectedEnter() {}
  onSelectedLeave() {}
  onSelectedHighlightEnter() {}
  onSelectedHighlightLeave() {}
  onIndirectHighlightEnter() {}
  onIndirectHighlightLeave() {}

  isActive() {
    return this.stateMachine.stateProperties.active === PROPERTY_VALUES.ON;
  }

  handleComponentTimeEvent() {
    if (this.needsUpdate) {
      this.update();
      this.sceneObject.scene.renderScene();
    }
  }

  update() {}

  // helper methods
  changeXYZOf(object, x, y, z) {
    object.x = x;
    object.y = y;
    object.z = z;
  }

  changeRGBOf(object, r, g, b) {
    object.r = r;
    object.g = g;
    object.b = b;
  }

  dispose() {
    this.timeEvent.dispose();

    this.needsUpdate = false;
  }
}
