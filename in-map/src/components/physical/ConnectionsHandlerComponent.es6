import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import Connection from 'in-map/src/mapSceneObjects/physical/Connection';

import BaseConnectionsHandlerComponent from '../common/ConnectionsHandlerComponent';


export default class ConnectionsHandlerComponent extends BaseConnectionsHandlerComponent {
  constructor({sceneObject}) {
    super({sceneObject, id: '_physicalConnectionsHandler'});
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  createNewConnection(config) {
    return new Connection(config);
  }

  dispose() {
    super.dispose();
  }
}
