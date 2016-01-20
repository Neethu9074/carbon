import _ from 'lodash';

import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import {hexToRGBNormalized} from 'in-services/converters';
import {getColor} from 'in-services/util/groupColors';
import eventBus from 'in-services/eventbus';

import GroundHighlightingComponent from '../../components/GroundHighlightingComponent';
import LineMeshComponent from '../../components/LineMeshComponent';

import SceneObjectWithSnapshot from '../SceneObjectWithSnapshot';
import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import StickyNote from '../../StickyNotes/Groups/PhysicalGroup';
import Node from '../Nodes/Node';

import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import FCP from '../../SingleMeshFactory/ContentProvider/FrameContentProvider';


export default class Group extends SceneObjectWithSnapshot {
  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this.stickyNote = new StickyNote(this);
    this.children = [];
    this.zSize = 1;

    this.addSubscription(eventBus.on('endUpdate').subscribe(() => this.update()));
  }

  onHighlightEnter() {
    this.getComponent('highlight').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  onHighlightLeave() {
    this.getComponent('highlight').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onSelectedEnter() {
    this.getComponent('mesh').colorChanged(1.0, 1.0, 1.0);
    this.stickyNote.setActive();
  }

  onSelectedLeave() {
    const color = this.getColor();
    this.getComponent('mesh').colorChanged(color.r, color.g, color.b);

    this.stickyNote.setActive(false);
  }

  onSelectedHighlightEnter() {
    this.getComponent('highlight').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);

    this.getComponent('mesh').colorChanged(1.0, 1.0, 1.0);

    this.stickyNote.setActive();
  }

  onSelectedHighlightLeave() {
    this.getComponent('highlight').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);

    const color = this.getColor();
    this.getComponent('mesh').colorChanged(color.r, color.g, color.b);

    this.stickyNote.setActive(false);
  }

  highlight(highlighted = true) {
    const propState = highlighted ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
    this.stateMachine.changeStateProperty('highlight', propState);
  }


  initComponents() {
    super.initComponents();

    const sceneObject = this;
    const color = this.getColor();
    const components = this.components;

    // add the mesh component to handle visual representation of the node
    components.mesh = new LineMeshComponent({
      sceneObject,
      factory: this.scene.groundLineFactory,
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: new FCP()
        })
      })
    });
    components.mesh.colorChanged(color.r, color.g, color.b);

    components.highlight = new GroundHighlightingComponent({sceneObject});
    components.highlight.colorChanged(color.r, color.g, color.b);
  }

  onMouseEnterOnSticky() {
    this.getComponent('highlight').stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);
  }

  onMouseLeaveOnSticky() {
    this.getComponent('highlight').stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  onSnapshotUpdated() {}

  onGroupClicked() {
    selectedSnapshot.setSelectedEntityId(this.id);
  }

  getColor() {
    return hexToRGBNormalized(getColor(this.id));
  }

  getAllMapNodes() {
    return this.parent.getAllMapNodes();
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
    if (this.isDisposed) {
      return;
    }
    this.getComponent('mesh').positionChanged(x, y, z);
    this.getComponent('highlight').positionChanged(x, y - 0.01, z);
    this.updateScreenAnchorPosition();
  }

  setScale(x, y, z) {
    if (this.isDisposed) {
      return;
    }
    this.zSize = z;

    this.getComponent('mesh').sizeChanged(x, y, z);
    this.getComponent('highlight').sizeChanged(x, y, z);
    this.updateScreenAnchorPosition();
  }

  addNode(entity) {
    const nodeId = entity.get('id');
    let matchedNode = _.find(this.children, child => child.id === nodeId);

    // if the node was created in the past
    if (!matchedNode) {
      matchedNode = new Node({parent: this, entity});
      this.children.push(matchedNode);
    }

    // set layer and connections, no matter if a new node was created or it's still available
    matchedNode.setChildren(entity.get('children'));
    matchedNode.setOutgoingConnections(entity.get('outgoingConnections'));
    matchedNode.setIncomingConnections(entity.get('incomingConnections'));

    return matchedNode;
  }

  addGroup(group) {
    const children = this.children;
    for (let i = 0; i < children.length; i++) {
      if (children[i].id === group.id) {
        return;
      }
    }

    group.parent = this;
    this.children.push(group);
  }

  removeChild(child) {
    _.remove(this.children, node => node.id === child.id);

    // destroy this group if there are no children anymore
    if (this.children.length === 0) {
      // remove this from parents groups collection
      this.parent.removeChild(this);
      this.dispose();
    }
  }

  dispose() {
    if (this.isDisposed) {
      return;
    }
    this.isDisposed = true;
    super.dispose();

    this.children.slice().forEach(node => node.dispose());
    this.children = [];

    if (this.stickyNote) {
      this.stickyNote.dispose();
      this.stickyNote = null;
    }

    this.id = null;
  }
}
