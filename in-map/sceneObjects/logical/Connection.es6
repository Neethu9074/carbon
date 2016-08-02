import ScreenPositionComponent from 'in-map/sceneObjectComponents/ScreenPositionComponent';
import LCP from 'in-map/singleMeshFactories/ContentProvider/LineContentProvider';
import CollisionComponent from 'in-map/sceneObjectComponents/CollisionComponent';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';
import MeshComponent from 'in-map/sceneObjectComponents/MeshComponent';

import {
  shortenPathAtSourceAndDestination,
  addArrowToDestination,
  flatten
} from 'in-map/misc/Connections';
import ConnectionStickyNote from 'in-map/components/stickyNotes/logical/Connection';
import stickyNotes from 'in-map/stores/stickyNotes/stickyNotes';
import connections from 'in-map/stores/logical/connections';
import SceneObject from 'in-map/sceneObjects/SceneObject';
import {collisionDetection} from 'in-map/misc/Physics';
import {emptyArray} from 'in-services/fixedObjects';
import {eventBus} from 'in-map/services/eventBus';


export default class Connection extends SceneObject {

  constructor(params) {
    super(params.id);

    this.destinationNode = params.destinationNode;
    this.sourceNode = params.sourceNode;
  }

  init() {
    super.init();

    stickyNotes.add(this.id, {
      type: ConnectionStickyNote,
      eventEmitter: this.eventEmitter,
      props: {
        id: this.id
      }
    });
  }

  initComponents() {
    super.initComponents();

    this.lineContentProvider = new LCP(this.getVertices.bind(this), this.getColors.bind(this));
    this.addComponent('mesh', new MeshComponent(this, this.lineContentProvider, 'lines'));

    this.addComponent('collision', new CollisionComponent(this,
                                                          collisionDetection.predefinedCollisionObjects.Box,
                                                          collisionDetection.OCTREE_LAYER.NODES));

    this.addComponent('snapshot', new SnapshotComponent(this));

    this.addComponent('screenPosition', new ScreenPositionComponent(this, pos => pos));

    connections.add(this.id, this);
  }

  initEvents() {
    super.initEvents();

    this.addSubscription(eventBus.on('zoomLevelChanged').subscribe(zoomLevel =>
      this.eventEmitter.emit('isFullyVisible', zoomLevel < 200)));
  }

  getVertices() {
    const fromTransform = this.sourceNode.getComponent('transform');
    const toTransform = this.destinationNode.getComponent('transform');
    if (!fromTransform || !toTransform) {
      return emptyArray;
    }
    const from = fromTransform.getPosition().clone();
    const to = toTransform.getPosition().clone();

    const path = flatten(
                 addArrowToDestination(
                 shortenPathAtSourceAndDestination([from, to])));

    const pos = from.add(to.sub(from).multiplyScalar(0.5));
    this.eventEmitter.emit('positionChanged', pos);

    return path;
  }

  getColors(vertices) {
    const colors = [];
    for (let i = 0, length = vertices.length; i < length; i++) {
      colors.push(1);
    }
    return colors;
  }

  dispose() {
    super.dispose();

    stickyNotes.remove(this.id);
    connections.remove(this.id);

    this.lineContentProvider = null;
    this.destinationNode = null;
    this.sourceNode = null;
  }
}
