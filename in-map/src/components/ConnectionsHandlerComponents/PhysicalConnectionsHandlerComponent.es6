import PhysicalConnection from '../../SceneObjects/Connections/PhysicalConnection';
import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import ConnectionsHandlerComponent from './ConnectionsHandlerComponent';


export default class PhysicalConnectionsHandlerComponent extends ConnectionsHandlerComponent {
  constructor({sceneObject}) {
    super({sceneObject, id: '_physicalConnectionsHandler'});
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  createNewConnection(config) {
    return new PhysicalConnection(config);
  }

  dispose() {
    super.dispose();
  }
}
