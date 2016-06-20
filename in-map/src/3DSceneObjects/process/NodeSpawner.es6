import immutable from 'immutable';

import {voteUp, nodeIdVoting$} from 'in-map/src/stores/process/nodesStore';
import NodePhysical from 'in-map/src/3DSceneObjects/process/NodePhysical';
import NodeCluster from 'in-map/src/3DSceneObjects/process/NodeCluster';
import {emptyArray} from 'in-services/fixedObjects';


export default class NodeSpawner {

  constructor(id, map, nodesParents) {
    this.id = id;
    this.map = map;
    this.chidlIds = {};
    this.isVisible = false;
    this.nodesParents = nodesParents || emptyArray;

    if (this.nodesParents.length === 0) {
      voteUp(id);
    }

    this.visibleSubscription = nodeIdVoting$.subscribe(nodeMap => {
      nodeMap[id] > 0 ?
        this.setVisible(true) :
        this.setVisible(false);
    });
  }

  setVisible(isVisible) {
    if (isVisible === this.isVisible) {
      return;
    }

    this.disposeNode();
    if (isVisible) {
      const props = {
        parent: this.map,
        entity: immutable.fromJS({
          id: this.id,
          plugin: 'node'
        })
      };
      this.node = this.nodesParents.length === 0 ?
        new NodeCluster(props) :
        new NodePhysical(props);
      this.node.setChildIds(this.chidlIds);
    }
    this.isVisible = isVisible;
  }

  disposeNode() {
    if (this.node) {
      this.node.dispose();
    }
    this.node = undefined;
  }

  addChild(childId) {
    this.chidlIds[childId] = true;
    if (this.node) {
      this.node.setChildIds(this.chidlIds);
    }
  }

  dispose() {
    this.visibleSubscription.dispose();
    this.disposeNode();

    this.nodesParents = null;
    this.isVisible = null;
    this.chidlIds = null;
    this.map = null;
    this.id = null;
  }
}
