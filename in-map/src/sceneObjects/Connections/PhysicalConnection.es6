import THREE from 'three';

import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import {DIRECTIONS} from '../Connections/ConnectionDirections';
import ConnectionGrid from '../../ConnectionGrid';
import BaseConnection from './BaseConnection';


export default class PhysicalConnection extends BaseConnection {

  constructor(params) {
    super(params);
  }

  setStartingStateProperties() {
    this.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
  }

  getMaterial() {
    return new THREE.LineBasicMaterial({
      color: 0xBBBBBB,
      visible: false,
      linewidth: 2
    });
  }

  calculatePath(fromPos, toPos) {
    const path = ConnectionGrid.getPath({
      fromX: fromPos.x,
      fromY: -fromPos.z, // connectionGrid uses positive z space, so invert
      toX: toPos.x,
      toY: -toPos.z
    });

    const preparedPath = [];
    for (let i = 0; i < path.length - 1; i++) {
      const current = path[i].position;
      const next = path[i + 1].position;
      preparedPath.push({x: current.x - 0.5, y: current.z, z: -current.y + 0.5});
      preparedPath.push({x: next.x - 0.5, y: next.z, z: -next.y + 0.5});
    }
    return preparedPath;
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

  getDirectionForPoints(a, b) {
    a.z = a.z || 0;
    b.z = b.z || 0;
    const dir = {x: b.x - a.x, y: b.y - a.y, z: b.z - a.z};

    // normalize them
    const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);
    dir.x /= (length);
    dir.y /= (length);
    dir.z /= (length);

    return dir;
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
  }
}
