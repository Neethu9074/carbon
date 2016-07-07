import THREE from 'three';

import {addSceneObject, removeSceneObject} from 'in-map/src/stores/sceneStore';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import BaseConnection from '../common/Connection';


export default class Connection extends BaseConnection {

  constructor(params) {
    super(params);
  }

  // physical connections are deactivated by default and only visible if a host is highlighted
  setStartingStateProperties() {
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onInitialEnter() {
    addSceneObject(this.mesh);
  }

  onInactiveEnter() {
    removeSceneObject(this.mesh);
  }

  setupGeometry() {
    // represents the geometry for all combined fragments
    this.geometry = new THREE.BufferGeometry();
    this.geometry.dynamic = true;

    this.material = new THREE.LineBasicMaterial({
      color: 0xBBBBBB,
      linewidth: 2
    });

    // a global mesh that stores global geometry
    const mesh = this.mesh = new THREE.LineSegments(this.geometry, this.material);
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = 2;
  }

  updateGeometry() {
    const vertices = new Float32Array(this.getLineVertices(this.sourceNode, this.destinationNode));

    this.geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    this.geometry.attributes.position.needsUpdate = true;
  }

  calculatePath(fromPos, toPos) {
    // connectionGrid uses positive z space, so invert
    return this.getPath(fromPos.x, -fromPos.z, toPos.x, -toPos.z);
  }

  getPath(fromX, fromY, toX, toY) {
    fromX -= 0.5;
    fromY -= 0.5;
    toX -= 0.5;
    toY -= 0.5;

    const p0 = { x: fromX, y: 0, z: -fromY };
    const p4 = { x: toX, y: 0, z: -toY };

    if (toX > fromX) {
      toX -= 1;
    } else {
      toX += 1;
    }
    if (toY > fromY) {
      fromY += 1;
    } else {
      fromY -= 1;
    }

    const p1 = { x: fromX, y: 0, z: -fromY };
    const p2 = { x: fromX + (toX - fromX), y: 0, z: -fromY };
    const p3 = { x: toX, y: 0, z: -toY };

    return [p0, p1, p1, p2, p2, p3, p3, p4];
  }

  dispose() {
    super.dispose();

    removeSceneObject(this.mesh);

    // clear three cache
    this.geometry.dispose();
    this.material.dispose();

    this.geometry = null;
    this.material = null;
    this.mesh = null;
  }
}
