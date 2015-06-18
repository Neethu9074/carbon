'use strict';

import THREE from 'three';

import Highlight from './Highlight';
import eventBus from 'instana-ui-services/eventbus';


export default class BaseNodeHighlight extends Highlight {

  constructor({client}) {
    super({client});

    this.subscription = eventBus.on('layoutChanged').subscribe(() => {
      this.refreshConnections();
    });
  }

  //sets the primary highlight whatever that means
  setHighlight() {
    const client = this.client;

    //just create one sticky
    if(client.stickyNoteHighlight.isEmpty) {
      client.stickyNoteHighlight = client.createStickyNoteHighlight();
    }

    //create outline effect using lines
    const pos = client.getPosition();
    const height = client.cube.scale.y;
    const fromX = pos.x + 0.01;
    const toX = pos.x - 1.01;
    const fromZ = pos.z - 0.01;
    const toZ = pos.z + 1.01;

    const points = [
      {x: toX, y: 0, z: fromZ},
      {x: toX, y: 0, z: toZ},

      {x: toX, y: 0, z: toZ},
      {x: fromX, y: 0, z: toZ},

      {x: toX, y: 0, z: fromZ},
      {x: toX, y: height, z: fromZ},

      {x: fromX, y: 0, z: toZ},
      {x: fromX, y: height, z: toZ},

      {x: toX, y: height, z: fromZ},
      {x: fromX, y: height, z: fromZ},

      {x: fromX, y: height, z: fromZ},
      {x: fromX, y: height, z: toZ}
    ];

    const factory = client.scene.lineFactory;
    factory.addFragment({id: client.id + '_h', points, highlighted: true});

    //show all connections of the node
    this.setupConnections();

    //make the changes visible
    client.renderScene();

    super.setHighlight();
  }

  //clears the primary highlighting
  clearHighlight() {
    const client = this.client;

    //don't dispose the highlighting twice
    if(!this.isHighlighted) {
      return;
    }

    //dispose all connections tangents this node
    client.clearConnections();

    client.scene.lineFactory.removeFragment(client.id + '_h');

    client.disposeStickyNoteHighlight();

    //make the changes visible
    client.renderScene();

    super.clearHighlight();
  }

  setIndirectHighlight(isSelected) {
    super.setIndirectHighlight();

    const client = this.client;
    const pos = client.getPosition();
    const points = [
      {x: pos.x + 0.01, y: 0, z: pos.z - 0.01},
      {x: pos.x - 1.01, y: 0, z: pos.z - 0.01},

      {x: pos.x - 1.01, y: 0, z: pos.z - 0.01},
      {x: pos.x - 1.01, y: 0, z: pos.z + 1.01},

      {x: pos.x - 1.01, y: 0, z: pos.z + 1.01},
      {x: pos.x, y: 0, z: pos.z + 1.01},

      {x: pos.x + 0.01, y: 0, z: pos.z + 1.01},
      {x: pos.x + 0.01, y: 0, z: pos.z - 0.01}
    ];

    const factory = client.scene.lineFactory;
    factory.addFragment({id: client.id, points, highlighted: isSelected});
  }

  clearIndirectHighlight() {
    super.clearIndirectHighlight();
  }

  setupConnections() {
    const client = this.client;

    client.clearConnections();

    //get all connections of this node
    const connectedSnapshots = client.collectConnections();
    if(!connectedSnapshots) {
      return;
    }

    //show all, incoming and outgoing connections
    this.setConnectionsWithDirection(connectedSnapshots.outgoing, 'out');
    this.setConnectionsWithDirection(connectedSnapshots.incoming, 'in');
  }

  setConnectionsWithDirection(connections, direction) {
    const client = this.client;
    connections
    .forEach(otherSnapshot => {
      const other = client.findNodeBySnapshot(otherSnapshot);
      if(other) {
        client.connectWith(other, direction);
      }
    });
  }

  refreshConnections() {
    const client = this.client;

    //reselect if the host is selected so that all geometry and
    //connections are refreshed
    if(client.isSelected) {
      client.unSelect();
      client.select();
    }

    //client is for unselected nodes which have incoming connections from
    //selected ones. if client position changes -> update the connection too
    client.incomingConnections.forEach(c => c.refresh());
  }

  //disposing the indirect highlighting if the counter is 0
  disposeIndirectHighlight() {
    const client = this.client;

    //only dispose sticky if this node isn't selected (e.g. mouseover)
    if(!client.isSelected) {
      client.disposeStickyNoteHighlight();
    }

    //remove frame on the ground
    client.scene.lineFactory.removeFragment(client.id);
  }

  dispose() {
    this.client.scene.lineFactory.removeFragment(this.client.id);

    this.subscription.dispose();
    this.subscription = null;
  }
}
