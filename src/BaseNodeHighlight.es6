'use strict';

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
    if(client.stickyNote.isEmpty) {
      client.stickyNote = client.createStickyNote();
    }

    //add the fargment to the highlight factory
    //so that the material is not faded by camera distance
    client.scene.highlightSingleMeshFactory
      .addFragment(client.getNodeAsFragment());

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

    //remove the highlight from the factory
    client.scene.highlightSingleMeshFactory.removeFragment(client.id);

    //dispose all connections tangents this node
    client.clearConnections();

    //only dispose the sticky note if there is no indirect/implicit highlight
    if(this.implicitHighlightCounter === 0) {
      client.disposeStickyNote();
    }

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

    if(client.stickyNote.isEmpty) {
      client.stickyNote = client.createStickyNote();
    }
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
    connectedSnapshots.outgoing.concat(connectedSnapshots.incoming)
    .forEach(otherSnapshot => {
      const other = client.findNodeBySnapshot(otherSnapshot);
      if(other) {
        client.connectWith(other);
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
      client.disposeStickyNote();
    }

    //remove frame on the ground
    client.scene.lineFactory.removeFragment(client.id);
  }

  dispose() {
    this.subscription.dispose();
    this.subscription = null;
  }
}
