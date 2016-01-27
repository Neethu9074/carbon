import THREE from 'three';

import eventBus from 'in-services/eventbus';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import SceneObjectWithSnapshot from '../SceneObjectWithSnapshot';


export const allConnections = [];

export default class BaseConnection extends SceneObjectWithSnapshot {

  constructor({parent, entity, sourceNode, destinationNode, direction}) {
    super({parent, id: entity.get('id')});

    this.direction = direction;
    this.sourceNode = sourceNode;
    this.destinationNode = destinationNode;

    this.calculateGeometry();
    this.scene.addSceneObject(this.mesh);

    allConnections.push(this);

    this.addSubscription(eventBus.on('layoutChanged').subscribe(() => this.calculateGeometry()));
  }

  getMaterial() { throw new Error('NOT IMPLEMENTED'); }
  calculatePath() { throw new Error('NOT IMPLEMENTED'); }
  postProPath() { throw new Error('NOT IMPLEMENTED'); }

  onInitialEnter() {
    this.material.visible = true;
  }

  onInitialLeave() {}

  onHighlightEnter() {
  }

  onHighlightLeave() {
  }

  onSelectedEnter() {}
  onSelectedLeave() {}

  onSelectedHighlightEnter() {}
  onSelectedHighlightLeave() {}

  onHiddenEnter() {}
  onHiddenLeave() {}

  onInactiveEnter() {
    this.material.visible = false;
  }


  init() {
    // represents the geometry for all combined fragments
    this.geometry = new THREE.BufferGeometry();
    this.geometry.dynamic = true;

    this.material = this.getMaterial();

    // a global mesh that stores global geometry
    const mesh = this.mesh = new THREE.LineSegments(this.geometry, this.material);
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = 2;
  }

  calculateGeometry() {
    this.geometry.addAttribute('position',
      new THREE.BufferAttribute(
        new Float32Array(this.getLineVertices(this.sourceNode, this.destinationNode)), 3));

    this.geometry.attributes.position.needsUpdate = true;
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
    const value = isHighlighted ? PROPERTY_VALUES.ON : PROPERTY_VALUES.OFF;
    this.stateMachine.changeStateProperty(PROPERTIES.HIGHLIGHT, value);
  }

  dispose() {
    super.dispose();
  }
}
