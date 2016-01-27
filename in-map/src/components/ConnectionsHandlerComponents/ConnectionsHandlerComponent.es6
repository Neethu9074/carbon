import Immutable from 'immutable';
import _ from 'lodash';

import {DIRECTIONS} from '../../SceneObjects/Connections/ConnectionDirections';
import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import Component from '../Component';


export default class ConnectionsHandlerComponent extends Component {
  constructor({sceneObject, id}) {
    super(sceneObject, id);

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

    const correspondingNode = this.sceneObject;

    const addConnections = (list, direction) => list.forEach(entity => {
      let destinationNode;
      let sourceNode;
      if (direction === DIRECTIONS.IN) {
        sourceNode = correspondingNode;
        destinationNode = this.sceneObject.findNodeById(entity.get('sourceId'));
      } else {
        sourceNode = correspondingNode;
        destinationNode = this.sceneObject.findNodeById(entity.get('destinationId'));
      }

      if (!sourceNode || !destinationNode) {
        return;
      }

      const connection = this.createNewConnection({
        parent: this,
        entity,
        direction,
        sourceNode,
        destinationNode
      });

      const isActive = this.isActive() ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
      connection.stateMachine.changeStateProperty('active', isActive);

      this.connections.push(connection);
    });

    addConnections(this.incomingConnections, DIRECTIONS.IN);
    addConnections(this.outgoingConnections, DIRECTIONS.OUT);

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
