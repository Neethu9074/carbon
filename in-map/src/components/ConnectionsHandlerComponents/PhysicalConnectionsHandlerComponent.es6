import PhysicalConnection from '../../SceneObjects/Connections/PhysicalConnection';
import ConnectionsHandlerComponent from './ConnectionsHandlerComponent';
import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';


export default class PhysicalConnectionsHandlerComponent extends ConnectionsHandlerComponent {
  constructor({sceneObject}) {
    super({sceneObject, id: '_physicalConnectionsHandler'});
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  createNewConnection(config) {
    return new PhysicalConnection(config);
  }

  dispose() {
    super.dispose();
  }
}
