import _ from 'lodash';

import * as selectedSnapshot from 'in-services/stores/selectedSnapshot';
import {hexToRGBNormalized} from 'in-services/converters';
import {getFullSnapshot} from 'in-services/snapshots';
import eventBus from 'in-services/eventbus';
import {getColor} from 'in-sdk/zones';

import GroundHighlightingComponent from '../../components/GroundHighlightingComponent';
import LineMeshComponent from '../../components/LineMeshComponent';

import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import UnknownNode from '../Nodes/UnknownNode';
import StickyNote from '../StickyNote/Ground';
import SceneObject from '../SceneObject';
import Node from '../Nodes/Node';

import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import FCP from '../../SingleMeshFactory/ContentProvider/FrameContentProvider';


export default class Group extends SceneObject {
  constructor({parent, id, coordinates}) {
    super({parent, id});

    this.children = [];
    this.zSize = 1;

    this.stickyNote = new StickyNote(this);

    if (coordinates) {
      this.coordinates = coordinates;
      this.addSubscription(getFullSnapshot(coordinates).subscribe(snapshot =>
        this.onSnapshotUpdate(snapshot))
      );
    }

    this.addSubscription(eventBus.on('endUpdate').subscribe(() => this.update()));

    this.addSubscription(selectedSnapshot.selectedSnapshot.subscribe(selected => {
      if (!selected || selected !== this.snapshot) {
        this.stateMachine.changeStateProperty('selected', PROPERTY_VALUES.OFF);
      } else if (selected && selected === this.snapshot) {
        this.stateMachine.changeStateProperty('selected', PROPERTY_VALUES.ON);
      }
    }));
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

    const id = this.id;
    const sceneObject = this;
    const color = this.getColor();
    const components = this.components;

    // add the mesh component to handle visual representation of the node
    components.mesh = new LineMeshComponent({
      id,
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

  onSnapshotUpdate(snapshot) {
    this.snapshot = snapshot;
  }

  onGroupClicked() {
    if (this.snapshot) {
      selectedSnapshot.select(this.snapshot);
    }
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
    if (this.isDisposed) {
      return;
    }
    this.getComponent('mesh').positionChanged(x, y, z);
    this.getComponent('highlight').positionChanged(x, y, z);
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

  addNode({coordinates, layer, connections, unknown = false}) {
    const nodeId = coordinates.get('id');
    let matchedNode;

    // if there is no nodeId it's an unknown node
    if (nodeId) {
      // check if the node was already created and only needs an update
      matchedNode = _.find(this.children, child => child.id === nodeId);

      // if the node was created in the past
      if (!matchedNode) {
        matchedNode = unknown ?
          new UnknownNode({parent: this, coordinates, id: nodeId}) :
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
