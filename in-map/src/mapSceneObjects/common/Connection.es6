import THREE from 'three';

import eventBus from 'in-services/eventbus';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import SceneObjectWithSnapshot from './SceneObjectWithSnapshot';


// this global array stores all connections to get a quick access to it when
// calculating the intersections in RaycasterModule
export const ALL_CONNECTIONS = [];

export const DIRECTIONS = {
  IN: 'in',
  OUT: 'out'
};

export default class Connection extends SceneObjectWithSnapshot {

  constructor({parent, entity, sourceNode, destinationNode, direction}) {
    super({parent, id: entity.get('id')});

    this.direction = direction;
    this.sourceNode = sourceNode;
    this.destinationNode = destinationNode;

    this.updateGeometry();

    ALL_CONNECTIONS.push(this);

    this.addSubscription(eventBus.on('layoutChanged').subscribe(() => this.updateGeometry()));
  }

  updateGeometry() { throw new Error('PLEASE OVERRIDE METHOD'); }
  setupGeometry() { throw new Error('PLEASE OVERRIDE METHOD'); }
  calculatePath() { throw new Error('PLEASE OVERRIDE METHOD'); }
  postProPath() { throw new Error('PLEASE OVERRIDE METHOD'); }

  init() {
    this.setupGeometry();
  }

  getLineVertices(from, to) {
    const fromPos = from.getComponent('position').getPosition().clone();
    const toPos = to.getComponent('position').getPosition().clone();

    // calculating the path
    let path = this.path = this.calculatePath(fromPos, toPos);
    this.calculateCollisionMesh(path);

    // postproduct the begining and the end lines to attach to the box's edges
    path = this.postProPath(path);

    // return the final line
    const flatPath = [];
    for (let i = 0; i < path.length; i++) {
      flatPath.push(path[i].x);
      flatPath.push(path[i].y);
      flatPath.push(path[i].z);
    }
    return flatPath;
  }

  onSnapshotUpdated() {}

  calculateCollisionMesh(path) {
    const geometry = new THREE.Geometry();
    for (let i = 0; i < path.length; i++) {
      geometry.vertices.push(new THREE.Vector3(path[i].x, path[i].y, path[i].z));
    }

    this.collisionLine = new THREE.Line(geometry);
  }

  intersects(raycaster) {
    if (!this.isActive() || !this.path || !this.collisionLine) {
      return false;
    }

    raycaster.linePrecision = 0.25;
    const hit = raycaster.intersectObject(this.collisionLine, false);
    return hit.length > 0;
  }

  onHighlight(isHighlighted) {
    this.stateMachine.changeStateProperty(PROPERTIES.HIGHLIGHT,
                                          isHighlighted ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF);
  }

  dispose() {
    super.dispose();
  }
}
