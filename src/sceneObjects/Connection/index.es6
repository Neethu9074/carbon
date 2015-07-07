'use strict';

import THREE from 'three';
import _ from 'lodash';
import SceneObject from '../SceneObject';
import ConnectionGrid from '../../ConnectionGrid';
import * as app from '../../Scene';
import {setupStates} from './States/index';

export const allConnections = [];
let id = 0;


export default class Connection extends SceneObject {

  constructor({from, to, direction}) {
    super({parent: from});

    // if(_.find(allConnections, c => (c.from === from && c.to === to))) {
    //   return;
    // }

    this.id = id++;
    this.from = from;
    this.to = to;
    this.direction = direction;

    this.calculatePath();

    from.addConnection(this);
    to.addIncomingConnection(this);

    this.render();
    this.hide();

    allConnections.push(this);
  }

  initStates() {
    return setupStates(this);
  }

  calculatePath() {
    const fromPos = this.from.getPosition();
    const toPos = this.to.getPosition();

    this.path = ConnectionGrid.getPath({
      fromX: fromPos.x,
      fromY: -fromPos.z, //connectionGrid uses positive z space, so invert
      toX: toPos.x,
      toY: -toPos.z
    });

    if(this.path) {
      // this.postProcessPath();
    }
  }

  render() {
    if(!this.path) {
      return;
    }

    this.points = this.calculateVertices(-0.01);

    const factory = this.getScene().lineFactory;
    factory.addFragment({id: this.id, points: this.points});

    //hide this if the parent is hidden
    if(this.from.hidden || this.to.hidden) {
      this.hide();
    }
  }

  calculateCollisionMesh(points) {
    const geometry = new THREE.Geometry();
    for (let i = 0; i < points.length; i++) {
      geometry.vertices.push(new THREE.Vector3(
        points[i].x, points[i].y, points[i].z));
    }

    this.collisionLine = new THREE.Line(geometry);
  }

  calculateVertices(height) {
    const points = [];

    //vertices have to be calculated in the following order:
    //[ p0, p1, p1, p2, p2, p3, ... ] the reason is that we use lineparts and
    //openGL is drawing the lines in this order
    for (let i = 1; i < this.path.length; i++) {
      const point = this.path[i];
      const nextPoint = this.path[i - 1];

      points.push({
        x: nextPoint.position.x - 0.5,
        y: height,
        z: -nextPoint.position.y + 0.5
      });
      points.push({
        x: point.position.x - 0.5,
        y: height,
        z: -point.position.y + 0.5
      });
    }
    this.calculateCollisionMesh(points);

    if(this.direction === 'in') {
      this.addArrow(points, 0, 1);
    } else {
      this.addArrow(points, points.length - 1, points.length - 2);
    }

    return points;
  }

  addArrow(points, from, to) {
    const arrowLength = 0.2;
    const fromP = points[from];
    const dir = this.getDirectionForPoints(points[from], points[to]);

    //because the arrow are laying on the ground, the up-vector is 0 1 0
    const right = new THREE.Vector3(0, 1, 0)
      .cross(dir)
      .multiplyScalar(arrowLength * 5); //shorten to get a angle < 45 degree
    const arrowLineX = (right.x + dir.x) * arrowLength;
    const arrowLineZ = (right.z + dir.z) * arrowLength;
    const arrowLineXLeft = (-right.x + dir.x) * arrowLength;
    const arrowLineZLeft = (-right.z + dir.z) * arrowLength;

    points.push(fromP);
    points.push({
      x: fromP.x + arrowLineX, y: fromP.y, z: fromP.z + arrowLineZ
    });

    points.push(fromP);
    points.push({
      x: fromP.x + arrowLineXLeft, y: fromP.y, z: fromP.z + arrowLineZLeft
    });
  }

  postProcessPath() {
    const path = this.path; //path -> [ [x, y], [x2, y2], ... ]
    const pathLength = path.length;
    const first = {x: path[0].position.x, y: path[0].position.x};
    const second = {x: path[1].position.x, y: path[1].position.y};
    const beforeLast = {x: path[pathLength - 2].position.x, y: path[pathLength - 2].position.y};
    const last = {x: path[pathLength - 1].position.x, y: path[pathLength - 1].position.y};
    const dirFirstToSecond = this.getDirectionForPoints(first, second);
    const dirlastToBeforeLast = this.getDirectionForPoints(last, beforeLast);

    //caps the first and last line of the connection. nodes have a size of 1 and
    //normally the connection goes from center (0.5, 0.5) to center. with this
    //capping it begins on the edge of the first and ends on the edge of the
    //last node. to get the right of the four possible we need the direction
    //directions are normalized so you can multiply with 0.5
    path[0].position.x += dirFirstToSecond.x * 0.5;
    path[0].position.y += dirFirstToSecond.y * 0.5;
    path[pathLength - 1].position.x += dirlastToBeforeLast.x * 0.5;
    path[pathLength - 1].position.y += dirlastToBeforeLast.y * 0.5;
  }

  getDirectionForPoints(a, b) {
    a.z = a.z || 0;
    b.z = b.z || 0;
    const dir = {x: b.x - a.x, y: b.y - a.y, z: b.z - a.z};

    //normalize them
    const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);
    dir.x /= (length);
    dir.y /= (length);
    dir.z /= (length);

    return dir;
  }

  intersects(raycaster) {
    if(this.hidden) {
      return false;
    }

    const path = this.path;
    if(!path || !this.collisionLine) {
      return false;
    }

    raycaster.linePrecision = 0.25;
    const hit = raycaster.intersectObject(this.collisionLine, false);
    return hit.length > 0;
  }

  select() {
    const scene = this.getScene();

    scene.lineFactory.highlightFragment(this.id, true);

    // this.to.highlighting.setIndirectHighlight(true);
    // this.from.highlighting.setIndirectHighlight(true);

    scene.renderScene();
  }

  unSelect() {
    const scene = this.getScene();

    scene.lineFactory.highlightFragment(this.id, false);

    // this.from.highlighting.clearIndirectHighlight();
    // this.to.highlighting.clearIndirectHighlight();

    scene.renderScene();
  }

  show() {
    if(this.hidden) {
      super.show(); //set this.hidden = false

      this.getScene().lineFactory.enableFragment(this.id);

      // this.to.highlighting.setIndirectHighlight(false);
      // this.from.highlighting.setIndirectHighlight(false);
    }
  }

  hide() {
    if(!this.hidden && !this.to.isSelected() && !this.from.isSelected()) {
      super.hide(); //set this.hidden = true

      this.getScene().lineFactory.enableFragment(this.id, false);

      // this.from.highlighting.clearIndirectHighlight();
      // this.to.highlighting.clearIndirectHighlight();
    }
  }

  updateOfVisualComponents() {
    //render() will call setIndirectHighlight, so clear it before
    this.from.highlighting.clearIndirectHighlight();
    this.to.highlighting.clearIndirectHighlight();

    this.calculatePath();
    this.render();
  }

  disposeCollisionLine() {
    if(this.collisionLine) {
      this.collisionLine.geometry.dispose();
      this.collisionLine = null;
    }
  }

  dispose() {
    _.remove(allConnections, c => c.id === this.id);

    this.disposeCollisionLine();

    //this connection is done with the implicit highlighting so decrease the
    //counter by calling clearIndirectHighlight
    this.from.highlighting.clearIndirectHighlight();
    this.to.highlighting.clearIndirectHighlight();

    this.from.removeConnection(this);
    this.to.removeIncomingConnection(this);

    app.scene.scene.lineFactory.removeFragment(this.id);
    super.dispose();
  }
}
