import _ from 'lodash';

import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import Connection from '../../sceneObjects/Connection';
import Component from '../Component';


export default class ConnectionComponent extends Component {

  constructor({sceneObject}) {
    super(sceneObject, '_connection');

    this.connections = [];
    this.lineFactory = sceneObject.scene.lineFactory;

    this.initialized();
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onHighlightEnter() {
    this.setupConnections();
    this.getAllConnections().forEach(c => c.stateMachine.changeStateProperty('highlight', PROPERTY_VALUES.ON));

    this.lineFactory.rebuild();
  }

  onSelectedEnter() {
    this.setupConnections();
    this.getAllConnections().forEach(c => c.stateMachine.changeStateProperty('selected', PROPERTY_VALUES.ON));

    this.lineFactory.rebuild();
  }

  onSelectedHighlightEnter() {
    this.setupConnections();
    this.getAllConnections().forEach(c => c.stateMachine.changeStateProperty('selected', PROPERTY_VALUES.ON));

    this.lineFactory.rebuild();
  }

  onInactiveEnter() {
    this.clearConnections();
  }

  positionChanged() {}

  setupConnections() {
    const wiredSnapshots = this.sceneObject.getWiredSnapshots();
    if (!wiredSnapshots) {
      return;
    }

    this.clearConnections();

    this.setConnectionsWithDirection(wiredSnapshots.outgoing, 'out');
    this.setConnectionsWithDirection(wiredSnapshots.incoming, 'in');
  }

  clearConnections() {
    this.getAllConnections().forEach(connection => connection.dispose());
    this.connections = [];
  }

  getAllConnections() {
    return this.connections;
  }

  setConnectionsWithDirection(connections, direction) {
    connections.forEach(otherSnapshot => {
      const other = this.sceneObject.findNodeById(otherSnapshot.get('id'));
      if (other) {
        this.connectWith(other, direction);
      }
    });
  }

  connectWith(otherNode, direction) {
    // don't setup a new connection if it's still alive
    if (this.connections.indexOf(otherNode) >= 0) {
      return;
    }

    this.connections.push(new Connection({
      from: this.sceneObject,
      to: otherNode,
      direction
    }));
  }

  // is called from Connection class when creating a new connection
  addConnection(connection) {
    this.connections.push(connection);
  }

  // is called from Connection class on disposing
  removeConnection(connection) {
    _.remove(this.connections, con => con.id === connection.id);
  }

  isConnectedToSelected() {
    let is = false;

    this.getAllConnections().forEach((c) => {
      if (c.isSelected()) {
        is = true;
        return;
      }
    });
    return is;
  }

  dispose() {
    super.dispose();

    this.clearConnections();
    this.connections = null;
    this.highlighted = null;
  }
}
