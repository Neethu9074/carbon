import Subscriber from 'in-map/misc/Subscriber';

export default class Node extends Subscriber {
  constructor({ InstanceType, params }) {
    super();

    this.id = params.id;
    this.params = params;
    this.children = {};

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
    const child = this.children[params.id];
    if (!child) {
      this.children[params.id] = new NodeType(params);
    }

    // don't create child if it's already there
  }

  removeChild(id) {
    const child = this.children[id];
    if (child) {
      child.dispose();
      delete this.children[id];
    }
  }

  update() {}

  updateEntities(entities) {
    const currentNodesMap = {};
    const currentNodes = [];
    for (let i = 0, length = entities.length; i < length; i++) {
      const entity = entities[i];
      currentNodesMap[entity.params.id] = entity;
      currentNodes.push(entity);
    }

    // remove nodes, which are not in the entity list anymore
    const oldNodesMap = Object.keys(this.children);
    for (let i = 0, length = oldNodesMap.length; i < length; i++) {
      const nodeId = oldNodesMap[i];
      if (!currentNodesMap[nodeId]) {
        this.removeChild(nodeId);
      }
    }

    // update or create nodes
    for (let i = 0, length = currentNodes.length; i < length; i++) {
      const entity = currentNodes[i];
      const existingChild = this.children[entity.params.id];

      if (existingChild) {
        if (existingChild.params !== entity.params) {
          existingChild.update(existingChild.params, entity.params);
          existingChild.params = entity.params;
        }
      } else {
        this.addChild(entity.NodeType, entity.params);
      }
    }
  }

  disposeChildren() {
    const currentChildren = Object.keys(this.children);
    for (let i = 0, length = currentChildren.length; i < length; i++) {
      this.removeChild(currentChildren[i]);
    }
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
