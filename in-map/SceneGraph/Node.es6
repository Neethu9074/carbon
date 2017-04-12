import Subscriber from 'in-map/misc/Subscriber';

export default class Node extends Subscriber {

  constructor({InstanceType, params}) {
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
    this.children[params.id] = new NodeType(params);
  }

  removeChild(id) {
    const child = this.children[id];
    if (child) {
      child.dispose();
      delete this.children[id];
    }
  }

  update() {}

  updateEntities(newNodes) {
    const newNodesMap = {};
    for (let i = 0, length = newNodes.length; i < length; i++) {
      const entity = newNodes[i];
      newNodesMap[entity.params.id] = entity;
    }

    const currentNodes = Object.keys(this.children);
    for (let i = 0, length = currentNodes.length; i < length; i++) {
      const nodeId = this.children[currentNodes[i]];
      if (!newNodesMap[nodeId]) {
        this.removeChild(nodeId);
      }
    }

    // update or create nodes
    for (let i = 0, length = newNodes.length; i < length; i++) {
      const entity = newNodes[i];
      const existingChild = this.children[entity.params.id];

      // create or update node
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
