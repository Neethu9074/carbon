import remove from 'lodash/remove';

import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/physical/Group';
import {getColorPool} from 'in-services/util/ColorGenerator';
import {find} from 'in-services/arrayUtils';
import eventBus from 'in-map/eventbus';

import GroundHighlightingComponent from '../../components/physical/GroundHighlightingComponent';
import LineMeshComponent from '../../components/common/LineMeshComponent';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import SceneObjectWithSnapshot from '../common/SceneObjectWithSnapshot';
import Node from './Node';

import PCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from '../../SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import FCP from '../../SingleMeshFactory/ContentProvider/FrameContentProvider';


export default class Group extends SceneObjectWithSnapshot {
  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this._cachedLabel = this.id;

    this.addSubscription(eventBus.on('endUpdate').subscribe(() => this.update()));
    this.addSubscription(this.eventEmitter.on('positionChanged').subscribe(this.updateScreenAnchorPosition.bind(this)));
  }

  // will be called before subscriptions are handled
  init() {
    this.stickyNote = new StickyNote(this);
    this.children = [];
    this.depth = 1;
  }

  onHighlightEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onHighlightLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSelectedEnter() {
    this.eventEmitter.emit('colorChanged', { r: 1, g: 1, b: 1 });
    this.stickyNote.setActive();
  }

  onSelectedLeave() {
    this.eventEmitter.emit('colorChanged', this.getColor());

    this.stickyNote.setActive(false);
  }

  onSelectedHighlightEnter() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);

    this.eventEmitter.emit('colorChanged', { r: 1, g: 1, b: 1 });

    this.stickyNote.setActive();
  }

  onSelectedHighlightLeave() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);

    this.eventEmitter.emit('colorChanged', this.getColor());

    this.stickyNote.setActive(false);
  }


  initComponents() {
    super.initComponents();

    const sceneObject = this;
    const color = this.getColor();
    const components = this.components;

    // add the mesh component to handle visual representation of the node
    components.mesh = new LineMeshComponent({
      sceneObject,
      factory: this.scene.lineFactory,
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: new FCP()
        })
      })
    });
    components.mesh.colorChanged(color);

    components.highlight = new GroundHighlightingComponent({sceneObject});
  }

  onMouseEnterOnSticky() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);
  }

  onMouseLeaveOnSticky() {
    this.changeComponentState('highlight', PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onSnapshotUpdated(snapshot) {
    this._cachedLabel = snapshot ? snapshot.getIn(['data', 'groupId']) : this._cachedLabel;
    this.parent.layoutNeedsUpdate();
  }

  getColor() {
    return getColorPool('groups').getColorRGB(this.id);
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
    super.setScreenPositionAnchor(pos.x, pos.y, pos.z + this.depth / 2);
  }

  setScale(x, y, z) {
    this.depth = z;

    // this.getComponent('mesh').sizeChanged({x, y, z});
    this.eventEmitter.emit('sizeChanged', { x, y, z });
    this.getComponent('highlight').sizeChanged(x, y, z);
    this.updateScreenAnchorPosition();
  }

  addNode(entity) {
    const nodeId = entity.get('id');
    let matchedNode = find(this.children, child => child.id === nodeId);

    // if the node was created in the past
    if (!matchedNode) {
      matchedNode = new Node({parent: this, entity});
      this.children.push(matchedNode);
    }

    // set layer and connections, no matter if a new node was created or it's still available
    matchedNode.setChildren(entity.get('children'));

    // first set both, incoming and outgoing connections, then rebuild the geometry
    const connectionsHandler = matchedNode.getComponent('connectionsHandler');
    connectionsHandler.setOutgoingConnections(entity.get('outgoingConnections'));
    connectionsHandler.setIncomingConnections(entity.get('incomingConnections'));
    connectionsHandler.checkForUpdate();

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
    remove(this.children, node => node.id === child.id);

    // destroy this group if there are no children anymore
    if (this.children.length === 0) {
      // remove this from parents groups collection
      this.parent.removeChild(this);
      this.dispose();
    }
  }

  dispose() {
    super.dispose();

    this.children.slice().forEach(node => node.dispose());
    this.children = [];

    this.stickyNote.dispose();
    this.stickyNote = null;

    this.id = null;
  }
}
