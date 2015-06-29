'use strict';

/*eslint-disable max-len*/
import THREE from 'three';

import Highlight from '../Highlight';
import eventBus from 'instana-ui-services/eventbus';
import FCP from '../../SingleMeshFactory/ContentProvider/FrameContentProvider';
import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import VATOCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/VertexArrayToObjectContentManipulator';
import {getWiredSnapshots} from 'instana-ui-sdk/snapshot';
/*eslint-enable max-len*/

export default class NodeHighlight extends Highlight {

  constructor({client}) {
    super({client});

    this.subscription = eventBus.on('layoutChanged').subscribe(() => {
      this.refreshConnections();
    });

    this.tooltip = undefined;
  }

  //sets the primary highlight whatever that means
  setHighlight() {
    if(this.isHighlighted) {
      return;
    }

    const client = this.client;

    this.setupHighlightBorderLines(client);

    //show all connections of the node
    this.setupConnections();

    //make the changes visible
    client.renderScene();

    super.setHighlight();
  }

  setupHighlightBorderLines(client) {
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

    //make the changes visible
    client.renderScene();

    super.clearHighlight();
  }

  setIndirectHighlight(isSelected) {
    super.setIndirectHighlight();

    const client = this.client;
    const pos = client.getPosition().clone().add({x: -0.5, y: 0, z: 0.5});
    const size = {x: 1.04, y: 1, z: 1.04};
    const points = new VATOCM({
      contentProvider: new PCM({ //reposition
        contentProvider: new SCM({ //resize
          contentProvider: new FCP(), //get frame
          x: size.x, y: 1, z: size.z
        }),
        x: pos.x, y: pos.y, z: pos.z
      })
    }).getVertices();

    const factory = client.scene.lineFactory;

    factory.addFragment({id: client.id, points, highlighted: isSelected});

    client.scene.highlightingSingleMeshFactory
      .addFragment(client.getNodeAsFragment());

    client.stickyNote.setInactive(false);
  }

  clearIndirectHighlight() {
    super.clearIndirectHighlight();
  }

  //disposing the indirect highlighting if the counter is 0
  disposeIndirectHighlight() {
    const client = this.client;

    //remove frame on the ground
    client.scene.lineFactory.removeFragment(client.id);
    client.scene.highlightingSingleMeshFactory.removeFragment(client.id);

    if(client.isAnySnapshotSelected()) {
      client.stickyNote.setInactive(true);
    }
  }

  setupConnections() {
    const client = this.client;
    const wiredSnapshots = client.getWiredSnapshots();

    client.clearConnections();

    if(wiredSnapshots) {
      this.setConnectionsWithDirection(wiredSnapshots.get('outgoing'), 'out');
      this.setConnectionsWithDirection(wiredSnapshots.get('incoming'), 'in');
    }
  }

  setConnectionsWithDirection(connections, direction) {
    const client = this.client;
    connections.forEach(otherSnapshot => {
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
    client.incomingConnections.forEach(c => c.updateOfVisualComponents());
  }

  refresh() {
    if(!this.IndirectHighlightCounter) {
      return;
    }

    const client = this.client;
    const factory = client.scene.highlightingSingleMeshFactory;

    factory.removeFragment(client.id);
    factory.addFragment(client.getNodeAsFragment());
  }

  onMouseOver() {
    this.setHighlight();
  }

  onMouseOff() {
    //only disable highlighting if the node was not selected (is needed if
    //the node was selected and mouseoff was fired)
    if(!this.client.isSelected) {
      this.clearHighlight();
    }
  }

  dispose() {
    this.client.scene.lineFactory.removeFragment(this.client.id);
    this.client.scene.highlightingSingleMeshFactory
      .removeFragment(this.client.id);

    this.subscription.dispose();
    this.subscription = null;
  }
}
