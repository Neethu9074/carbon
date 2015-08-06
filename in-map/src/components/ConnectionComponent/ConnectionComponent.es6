'use strict';

import _ from 'lodash';
import Component from '../Component';
import Connection from '../../sceneObjects/Connection/index';


export default class ConnectionComponent extends Component{
  constructor({sceneObject}) {
    super(sceneObject);

    this.outgoingConnections = [];
    this.incomingConnections = [];

    this.initialized();
  }


  highlightChanged(highlighted) {
    if(this.highlighted === highlighted) {
      return;
    }

    if(highlighted) {
      this.setupConnections();
    }

    this.getAllConnections()
      .forEach(c => c.stateMachine.changeStateProperty('mouseOver', highlighted));

    this.highlighted = highlighted;
  }

  selectionChanged(selected) {
    if(this.selected === selected) {
      return;
    }

    if(selected) {
      this.getAllConnections().forEach((c) => {c.show(); c.select(); });
    } else {
      this.getAllConnections().forEach((c) => {c.unSelect(); c.hide(); });
    }

    this.selected = selected;
  }

  positionChanged() {
    this.getAllConnections().forEach(c => c.updateOfVisualComponents());
  }

  setupConnections() {
    const wiredSnapshots = this.sceneObject.getWiredSnapshots();
    if(!wiredSnapshots) {
      return;
    }

    this.clearConnections();

    this.setConnectionsWithDirection(wiredSnapshots.get('outgoing'), 'out');
    this.setConnectionsWithDirection(wiredSnapshots.get('incoming'), 'in');
  }

  clearConnections(force=false) {
    if(force) {
      this.getAllConnections().slice().forEach(c => c.dispose());

    } else {
      this.getAllConnections().slice()
        .filter(c => !c.isSelected())
        .forEach(c => c.dispose());
    }
  }

  getAllConnections() {
    return this.outgoingConnections.concat(this.incomingConnections);
  }

  setConnectionsWithDirection(connections, direction) {
    connections.forEach(otherSnapshot => {
      const other = this.sceneObject.findNodeBySnapshot(otherSnapshot);
      if(other) {
        this.connectWith(other, direction);
      }
    });
  }

  //connects this node with another one. the connection is stored in a
  //connections collection
  connectWith(otherNode, direction) {
    //don't setup a new connection if it's still alive
    if(this.outgoingConnections.indexOf(otherNode) >= 0) {
      return;
    }

    /*eslint-disable no-new*/
    new Connection({from: this.sceneObject, to: otherNode, direction});
    /*eslint-enable no-new*/
  }

  //is called from Connection class when creating a new connection
  addOutgoingConnection(connection) {
    this.outgoingConnections.push(connection);
  }

  addIncomingConnection(connection) {
    this.incomingConnections.push(connection);
  }

  //is called from Connection class on disposing
  removeOutgoingConnection(connection) {
    _.remove(this.outgoingConnections, con => con.id === connection.id);
  }

  //is called from Connection class on disposing
  removeIncomingConnection(connection) {
    _.remove(this.incomingConnections, con => con.id === connection.id);
  }

  isConnectedToSelected() {
    let is = false;

    this.getAllConnections().forEach((c) => {
      if(c.isSelected()) {
        is = true;
        return;
      }
    });
    return is;
  }

  dispose() {
    super.dispose();

    this.clearConnections(true);
  }
}
