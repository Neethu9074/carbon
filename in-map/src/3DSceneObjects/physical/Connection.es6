import THREE from 'three';

import {PROPERTIES, PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import BaseConnection from '../common/Connection';
import {DIRECTIONS} from '../common/Connection';


export default class Connection extends BaseConnection {

  constructor(params) {
    super(params);
  }

  // physical connections are deactivated by default and only visible if a host is highlighted
  setStartingStateProperties() {
    this.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
  }

  onInitialEnter() {
    this.addSceneObject(this.mesh);
  }

  onInactiveEnter() {
    this.removeSceneObject(this.mesh);
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

  postProPath(path) {
    const pathLength = path.length;
    const first = path[0];
    const second = path[1];
    const beforeLast = path[pathLength - 2];
    const last = path[pathLength - 1];
    const dirFirstToSecond = this.getDirectionForPoints(first, second);
    const dirlastToBeforeLast = this.getDirectionForPoints(last, beforeLast);

    // caps the first and last line of the connection. nodes have a size of 1 and
    // normally the connection goes from center (0.5, 0.5) to center. with this
    // capping it begins on the edge of the first and ends on the edge of the
    // last node. to get the right of the four possible we need the direction
    // directions are normalized so you can multiply with 0.5
    first.x += dirFirstToSecond.x * 0.5;
    first.y += dirFirstToSecond.y * 0.5;
    first.z += dirFirstToSecond.z * 0.5;

    last.x += dirlastToBeforeLast.x * 0.5;
    last.y += dirlastToBeforeLast.y * 0.5;
    last.z += dirlastToBeforeLast.z * 0.5;

    return this.addArrowToDestination(path);
  }

  addArrowToDestination(path) {
    const from = this.direction === DIRECTIONS.IN ? 0 : path.length - 1;
    const to = this.direction === DIRECTIONS.IN ? 1 : path.length - 2;
    const arrowLength = 0.2;
    const fromP = path[from];
    const dir = this.getDirectionForPoints(path[from], path[to]);

    // because the arrow are laying on the ground, the up-vector is 0 1 0
    const right = new THREE.Vector3(0, 1, 0)
      .cross(dir)
      .multiplyScalar(arrowLength * 5); // shorten to get a angle < 45 degree
    const arrowLineX = (right.x + dir.x) * arrowLength;
    const arrowLineZ = (right.z + dir.z) * arrowLength;
    const arrowLineXLeft = (-right.x + dir.x) * arrowLength;
    const arrowLineZLeft = (-right.z + dir.z) * arrowLength;

    path.push(fromP);
    path.push({
      x: fromP.x + arrowLineX, y: fromP.y, z: fromP.z + arrowLineZ
    });

    path.push(fromP);
    path.push({
      x: fromP.x + arrowLineXLeft, y: fromP.y, z: fromP.z + arrowLineZLeft
    });

    return path;
  }

  dispose() {
    super.dispose();

    this.scene.removeSceneObject(this.mesh);

    // clear three cache
    this.geometry.dispose();
    this.material.dispose();

    this.geometry = null;
    this.material = null;
    this.mesh = null;
  }
}
