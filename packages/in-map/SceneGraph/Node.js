/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import Subscriber from 'in-map/misc/Subscriber';

export default class Node extends Subscriber {
  constructor({ InstanceType, params }) {
    super();

    this.id = params.id;
    this.params = params;
    this.children = new Map();
    this.newNodesMap = new Map();

    if (InstanceType) {
      this.sceneObjectInstance = new InstanceType(params);
      this.sceneObjectInstance.init();
      this.sceneObjectInstance.initComponents();
      this.sceneObjectInstance.initEvents();
      this.sceneObjectInstance.initialized();
    }

    this.update({}, params);
  }

  addChild(NodeType, params) {
    this.children.set(params.id, new NodeType(params));
  }

  removeChild(id) {
    const child = this.children.get(id);
    if (child) {
      child.dispose();
      this.children.delete(id);
    }
  }

  update() {}

  updateSnapshotAndHealthComponent(params) {
    if (this.sceneObjectInstance) {
      this.sceneObjectInstance.updateSnapshotAndHealthComponent(params);
    }
  }

  updateEntities(newNodes) {
    // edge case tweak: if there are no new children, remove all what is left
    if (newNodes.length === 0) {
      this.disposeChildren();
      this.sceneObjectInstance.afterUpdateEntities();
      return;
    }

    this.newNodesMap.clear();
    for (let i = 0, length = newNodes.length; i < length; i++) {
      const entity = newNodes[i];
      this.newNodesMap.set(entity.params.id, entity);
    }

    const nodesToDelete = [];
    let indexOfDeletedNodes = 0;
    this.children.forEach((val, nodeId) => {
      if (!this.newNodesMap.has(nodeId)) {
        nodesToDelete[indexOfDeletedNodes++] = nodeId;
      }
    });
    for (let i = 0, length = nodesToDelete.length; i < length; i++) {
      this.removeChild(nodesToDelete[i]);
    }

    // update or create nodes
    for (let i = 0, length = newNodes.length; i < length; i++) {
      const entity = newNodes[i];
      const existingChild = this.children.get(entity.params.id);

      if (existingChild) {
        if (existingChild.params !== entity.params) {
          existingChild.update(existingChild.params, entity.params);
          existingChild.updateSnapshotAndHealthComponent(entity.params);
          existingChild.params = entity.params;
        }
      } else {
        this.addChild(entity.NodeType, entity.params);
      }
    }

    this.sceneObjectInstance.afterUpdateEntities();
  }

  disposeChildren() {
    this.children.forEach(node => node.dispose());
    this.children.clear();
  }

  dispose() {
    super.dispose();

    this.disposeChildren();

    if (this.sceneObjectInstance) {
      this.sceneObjectInstance.disposeEvents();
      this.sceneObjectInstance.dispose();
      this.sceneObjectInstance = null;
    }

    this.children = null;
  }
}
