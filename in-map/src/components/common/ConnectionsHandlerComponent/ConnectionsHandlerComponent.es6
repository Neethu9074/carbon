import _ from 'lodash';

import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import {emptyList} from 'in-services/fixedImmutables';

import Component from '../Component';


export default class ConnectionsHandlerComponent extends Component {
  constructor({sceneObject, id}) {
    super(sceneObject, id);

    this.outgoingConnections = emptyList;
    this.incomingConnections = emptyList;

    // this array holds all physical connections, created on update
    this.connections = [];

    this.initialized();
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onInitialEnter() {
    this.connections.forEach(connection =>
      connection.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON));
  }

  onInactiveEnter() {
    this.connections.forEach(connection =>
      connection.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF));
  }


  setOutgoingConnections(outgoingConnections) {
    this.outgoingConnections = outgoingConnections;
  }

  getOutgoingConnections() {
    return this.outgoingConnections;
  }

  setIncomingConnections(incomingConnections) {
    this.incomingConnections = incomingConnections;
  }

  getIncomingConnections() {
    return this.incomingConnections;
  }

  checkForUpdate() {
    if (this.incomingConnections.size > 0 ||
        this.outgoingConnections.size > 0) {
      this.needsUpdate = true;
    }
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
      connection.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, isActive);

      this.connections.push(connection);
    });

    addConnections(this.outgoingConnections, DIRECTIONS.OUT);
    addConnections(this.incomingConnections, DIRECTIONS.IN);

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
