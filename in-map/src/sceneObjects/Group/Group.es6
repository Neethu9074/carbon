import _ from 'lodash';

import {hexToRGBNormalized} from 'in-services/converters';
import eventBus from 'in-services/eventbus';
import {getColor} from 'in-sdk/zones';

import LineMeshComponent from '../../components/LineMeshComponent';

import UnknownNode from '../Nodes/UnknownNode';
import StickyNote from '../StickyNote/Ground';
import SceneObject from '../SceneObject';
import Node from '../Nodes/Node';

import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import FCP from '../../SingleMeshFactory/ContentProvider/FrameContentProvider';


export default class Group extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    this.children = [];
    this.zSize = 1;

    this.stickyNote = new StickyNote(this);

    this.addSubscription(eventBus.on('endUpdate').subscribe(() => this.update()));
  }

  initComponents() {
    super.initComponents();

    const id = this.id;
    const color = this.getColor();
    const components = this.components;

    //add the mesh component to handle visual representation of the node
    components.mesh = new LineMeshComponent({
      id,
      sceneObject: this,
      factory: this.scene.groundLineFactory,
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: new FCP()
        })
      })
    });
    components.mesh.colorChanged(color.r, color.g, color.b);
  }

  getColor() {
    return hexToRGBNormalized(getColor(this.id));
  }

  update() {
    this.updateScreenPosition();

    if (this.isInView()) {
      this.stickyNote.update();
    } else {
      this.stickyNote.hide();
    }
  }

  updateScreenAnchorPosition() {
    const pos = this.getComponent('position').getPosition();
    super.setScreenPositionAnchor(pos.x, pos.y, pos.z + this.zSize / 2);
  }

  positionChanged(x, y, z) {
    this.getComponent('mesh').positionChanged(x, y, z);
    this.updateScreenAnchorPosition();
  }

  setScale(x, y, z) {
    this.zSize = z;

    this.getComponent('mesh').sizeChanged(x, y, z);
    this.updateScreenAnchorPosition();
  }

  addNode({coordinates, layer, connections, unknown = false}) {
    const nodeId = coordinates.get('id');
    let matchedNode;

    // if there is no nodeId it's an unknown node
    if (nodeId) {
      // check if the node was already created and only needs an update
      matchedNode = _.find(this.children, child => child.id === nodeId);

      // if the node was created in the past
      if (!matchedNode) {
        matchedNode = unknown ? new UnknownNode({parent: this, coordinates, id: nodeId}) :
                                new Node({parent: this, coordinates, id: nodeId, connections});
        this.children.push(matchedNode);
      }
      matchedNode.setLayer(layer);
      matchedNode.setWiredSnapshots(connections);
    }
    return matchedNode;
  }

  addUnknownNode(node) {
    if (this.id === 'unmonitored') {
      this.addNode({coordinates: node, unknown: true});
    } else {
      this.parent.addUnknownNode(node);
    }
  }

  addGroup(group) {
    if (this.children.indexOf(child => child.id === group.id) >= 0) {
      return;
    }

    this.children.push(group);
  }

  removeChild(child) {
    _.remove(this.children, node => node.id === child.id);

    //destroy this group if there are no children anymore
    if (this.children.length === 0) {
      //remove this from parents groups collection
      this.parent.removeChild(this);

      this.dispose();
    }
  }

  dispose() {
    super.dispose();

    this.children.forEach(node => node.dispose());
    this.children = [];

    if (this.stickyNote) {
      this.stickyNote.dispose();
      this.stickyNote = null;
    }

    this.id = null;
  }
}
