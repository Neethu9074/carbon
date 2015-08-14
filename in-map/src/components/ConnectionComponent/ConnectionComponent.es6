import _ from 'lodash';

import Connection from '../../sceneObjects/Connection/index';
import Component from '../Component';


export default class ConnectionComponent extends Component {

  constructor({sceneObject}) {
    super(sceneObject);

    this.connections = [];

    this.initialized();
  }

  onInactiveEnter() {
    this.clearConnections(true);
  }


  highlightChanged(highlighted) {
    if(this.highlighted === highlighted) {
      return;
    }

    if(highlighted) {
      this.setupConnections();
    }

    this.getAllConnections().forEach(c =>
      c.stateMachine.changeStateProperty('mouseOver', highlighted));

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

    this.clearConnections(true);

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
    return this.connections;
  }

  setConnectionsWithDirection(connections, direction) {
    connections.forEach(otherSnapshot => {
      const other = this.sceneObject.findNodeBySnapshot(otherSnapshot);
      if(other) {
        this.connectWith(other, direction);
      }
    });
  }

  connectWith(otherNode, direction) {
    // don't setup a new connection if it's still alive
    if(this.connections.indexOf(otherNode) >= 0) {
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

  //is called from Connection class on disposing
  removeConnection(connection) {
    _.remove(this.connections, con => con.id === connection.id);
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

    this.connections = null;
    this.highlighted = null;
  }
}
