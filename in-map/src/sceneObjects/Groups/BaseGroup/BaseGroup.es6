import _ from 'lodash';

import UnknownNode from '../../Nodes/UnknownNode';
import SceneObject from '../../SceneObject';
import Node from '../../Nodes/Node';


export default class BaseGroup extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    this.children = [];
    this.zSize = 1;
  }

  addNode({coordinates, layer, unknown = false}) {
    const nodeId = coordinates.get('id');
    let newNode;

    //if there is no nodeId it's an unknown node
    if(nodeId) {
      //check if the node was already created and only needs an update
      newNode = _.find(this.children, child => child.id === nodeId);

      //if the node was created in the past
      if(!newNode) {
        newNode = unknown ? new UnknownNode({parent: this, coordinates, id: nodeId}) :
                            new Node({parent: this, coordinates, id: nodeId, layer});
        this.children.push(newNode);
      }
    }
    return newNode;
  }

  addUnknownNode(node) {
    if(this.id === 'unmonitored') {
      this.addNode({coordinates: node, unknown: true});
    } else {
      this.parent.addUnknownNode(node);
    }
  }

  addGroup(group) {
    if(this.children.indexOf(child => child.id === group.id) >= 0) {
      return;
    }

    this.children.push(group);
  }

  setScale(x, y, z) {
    this.zSize = z;
  }

  removeChild(child) {
    _.remove(this.children, node => node.id === child.id);

    //destroy this group if there are no children anymore
    if(this.children.length === 0) {
      //remove this from parents groups collection
      this.parent.removeChild(this);

      this.dispose();
    }
  }

  dispose() {
    super.dispose();

    this.children.forEach(node => node.dispose());
    this.children = [];

    this.id = null;
  }
}
