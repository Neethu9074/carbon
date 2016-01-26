import Immutable from 'immutable';
import _ from 'lodash';

import PhysicalConnection from '../../SceneObjects/Connections/PhysicalConnection';
import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import Component from '../Component';


export default class ConnectionsHandlerComponent extends Component {
  constructor({sceneObject}) {
    super(sceneObject, '_connectionsHandler');

    this.outgoingConnections = Immutable.List();
    this.incomingConnections = Immutable.List();

    // this array holds all physical connections, created on update
    this.connections = [];

    this.initialized();
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onInitialEnter() {
    this.connections.forEach(connection => connection.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON));
  }

  onInactiveEnter() {
    this.connections.forEach(connection => connection.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF));
  }


  setOutgoingConnections(outgoingConnections) {
    this.outgoingConnections = outgoingConnections;

    if (outgoingConnections.size > 0) {
      this.needsUpdate = true;
    }
  }

  getOutgoingConnections() {
    return this.outgoingConnections;
  }

  setIncomingConnections(incomingConnections) {
    this.incomingConnections = incomingConnections;

    if (incomingConnections.size > 0) {
      this.needsUpdate = true;
    }
  }

  getIncomingConnections() {
    return this.incomingConnections;
  }

  update() {
    // clear all connections and rebuild on the current state
    this.disposeConnections();

    const addConnections = list => list.forEach(entity => {
      const sourceNode = this.sceneObject.findNodeById(entity.get('sourceId'));
      const destinationNode = this.sceneObject.findNodeById(entity.get('destinationId'));

      if (!sourceNode || !destinationNode) {
        return;
      }

      this.connections.push(
        new PhysicalConnection({
          parent: this,
          entity,
          sourceNode,
          destinationNode
        }));
      }
    );

    addConnections(this.incomingConnections);
    addConnections(this.outgoingConnections);

    this.needsUpdate = false;
  }

  removeChild(child) {
    _.remove(this.connections, con => con.id === child.id);
  }

  disposeConnections() {
    this.connections.slice().forEach(connection => connection.dispose());
  }

  dispose() {
    super.dispose();

    this.disposeConnections();
  }
}
