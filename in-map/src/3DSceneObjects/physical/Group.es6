import {remove} from 'lodash';

import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/physical/Group';
import {getColorPool} from 'in-services/util/ColorGenerator';
import {find} from 'in-services/arrayUtils';
import eventBus from 'in-map/src/eventbus';

import PCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/PositionContentManipulator';
import SCM from 'in-map/src/SingleMeshFactory/ContentProvider/ContentManipulator/ScaleContentManipulator';
import FCP from 'in-map/src/SingleMeshFactory/ContentProvider/FrameContentProvider';

import GroundHighlightingComponent from 'in-map/src/components/physical/GroundHighlightingComponent';
import SnapshotComponent from 'in-map/src/components/common/SnapshotComponent/SnapshotComponent';
import ScreenPositionComponent from 'in-map/src/components/common/ScreenPositionComponent';
import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import LineMeshComponent from 'in-map/src/components/common/LineMeshComponent';
import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import Node from 'in-map/src/3DSceneObjects/physical/Node';


export default class Group extends SceneObject {
  constructor({parent, entity}) {
    super({parent, id: entity.get('id')});

    this._cachedLabel = this.id;

    this.addSubscriptions([
      eventBus.on('endUpdate').subscribe(() => this.getComponent('screenPosition').updateScreenPosition()),

      this.eventEmitter.on('screenPositionChanged_screenPosition').subscribe(screenPosition =>
        this.stickyNote.update(screenPosition)),

      this.eventEmitter.on('snapshotChanged').subscribe(this.onSnapshotUpdated.bind(this)),

      this.eventEmitter.on('isVisibleChanged_screenPosition').distinct().subscribe(isVisible =>
        isVisible ?
          this.stickyNote.show() :
          this.stickyNote.hide()
      )
    ]);
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

    components.snapshot = new SnapshotComponent({sceneObject: this});

    // add the mesh component to handle visual representation of the node
    components.mesh = new LineMeshComponent({
      sceneObject,
      factory: this.getFactory('lineSMF'),
      contentProvider: new PCM({
        contentProvider: new SCM({
          contentProvider: new FCP()
        })
      })
    });
    components.mesh.colorChanged(color);

    components.highlight = new GroundHighlightingComponent({sceneObject});

    components.screenPosition = new ScreenPositionComponent({sceneObject, id: '_screenPosition'});
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

  setScale(x, y, z) {
    this.depth = z;

    // this.getComponent('mesh').sizeChanged({x, y, z});
    this.eventEmitter.emit('sizeChanged', { x, y, z });
    this.getComponent('highlight').sizeChanged(x, y, z);

    const pos = this.getComponent('position').getPosition();
    this.getComponent('screenPosition').set3DPositionToProject(pos.x, pos.y, pos.z + this.depth / 2);
  }

  addNode(entity, searchMatches) {
    const nodeId = entity.get('id');
    let matchedNode = find(this.children, child => child.id === nodeId);

    // if the node was created in the past
    if (!matchedNode) {
      matchedNode = new Node({parent: this, entity});
      this.children.push(matchedNode);
    }

    // set layer and connections, no matter if a new node was created or it's still available
    const children = searchMatches ?
      entity.get('children').filter(child => searchMatches.contains(child.get('id'))) :
      entity.get('children');

    matchedNode.setChildren(children);

    // first set both, incoming and outgoing connections, then rebuild the geometry
    const connectionsHandler = matchedNode.getComponent('connectionsHandler');
    connectionsHandler.setOutgoingConnections(entity.get('outgoingConnections'));
    connectionsHandler.setIncomingConnections(entity.get('incomingConnections'));
    connectionsHandler.checkForUpdate();

    return matchedNode;
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
