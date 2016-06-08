import Connection from 'in-map/src/3DSceneObjects/process/Connection';

import BaseConnectionsHandlerComponent from '../common/ConnectionsHandlerComponent';


export default class ConnectionsHandlerComponent extends BaseConnectionsHandlerComponent {

  constructor({sceneObject}) {
    super({sceneObject, id: '_processConnectionsHandler'});
  }

  createNewConnection(config) {
    const newConnection = new Connection(config);

    // set the current state to new incoming connections
    if (this.isAnimating) {
      newConnection.startAnimation();
    }

    return newConnection;
  }

  getFactory(name) {
    return this.sceneObject.getFactory(name);
  }

  setAnimating(value) {
    if (this.isAnimating === value) {
      return;
    }

    this.isAnimating = value;

    // set the "new" state for all current available connections
    value ?
      this.connections.forEach(connection => connection.startAnimation()) :
      this.connections.forEach(connection => connection.stopAnimation());
  }
}
