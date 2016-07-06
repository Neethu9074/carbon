import THREE from 'three';

import {renderConnectionLine} from 'in-map/src/2DSceneObjects/tooltips/physical/ConnectionLine';
import eventBus from 'in-map/src/eventbus';

import SceneObject from './SceneObject';


// this global array stores all connections to get a quick access to it when
// calculating the intersections in RaycasterModule
export const ALL_CONNECTIONS = [];

export const DIRECTIONS = {
  IN: 'in',
  OUT: 'out'
};

export default class Connection extends SceneObject {

  constructor({parent, entity, sourceNode, destinationNode, direction}) {
    super({parent, id: entity.get('id')});

    this.direction = direction;
    this.sourceNode = sourceNode;
    this.destinationNode = destinationNode;

    const fromPos = sourceNode.getComponent('position').getPosition();
    const toPos = destinationNode.getComponent('position').getPosition();

    // only do an initial geometry if the nodes where already layouted and are not on the same position
    // (which can happen before layouting)
    if (fromPos.x !== toPos.x || fromPos.z !== toPos.z) {
      this.updateGeometry();
    }

    ALL_CONNECTIONS.push(this);

    this.addSubscription(eventBus.on('layoutChanged').subscribe(() => this.updateGeometry()));
  }

  init() {
    super.init();

    this.withArrows = false;
  }

  updateGeometry() { throw new Error('PLEASE OVERRIDE METHOD'); }
  setupGeometry() { throw new Error('PLEASE OVERRIDE METHOD'); }
  calculatePath() { throw new Error('PLEASE OVERRIDE METHOD'); }

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

    if (this.withArrows) {
      return this.addArrowToDestination(path);
    }
    return path;
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

  getTooltipLine() {
    return renderConnectionLine(this);
  }

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

  dispose() {
    super.dispose();
  }
}
