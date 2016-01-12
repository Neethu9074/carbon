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
    this.sceneObject.getOutgoingConnections().forEach(connection => {
      const other = this.sceneObject.findNodeById(connection.get('destinationId'));
      if (other) {
        this.connections.push(new Connection({
          from: this.sceneObject,
          to: other,
          direction: 'out'
        }));
      }
    });

    this.sceneObject.getIncomingConnections().forEach(connection => {
      const other = this.sceneObject.findNodeById(connection.get('sourceId'));
      if (other) {
        this.connections.push(new Connection({
          from: this.sceneObject,
          to: other,
          direction: 'in'
        }));
      }
    });
  }

  clearConnections() {
    this.getAllConnections().forEach(connection => connection.dispose());
    this.connections = [];
  }

  getAllConnections() {
    return this.connections;
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
