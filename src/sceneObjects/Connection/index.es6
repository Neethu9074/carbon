'use strict';

import THREE from 'three';
import _ from 'lodash';
import SceneObject from '../SceneObject';
import ConnectionGrid from '../../ConnectionGrid_Temp';
import {hexToRGBNormalized} from 'instana-ui-services/converters';
import eventBus from 'instana-ui-services/eventbus';

const highlightColor = hexToRGBNormalized('#BFBFBF');
const mouseOverColor = hexToRGBNormalized('#FFFFFF');
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

    allConnections.push(this);

    this.addSubscription(eventBus.on('layoutChanged').subscribe(() => {
      this.updateOfVisualComponents();
    }));
  }

  onInitialEnter() {
    this.scene.lineFactory.enableFragment(this.id, false);
  }

  onInitialLeave() {
    //TODO: implement if there is something to do
  }

  onHighlightEnter() {
    this.enableFragment();
  }

  onHighlightLeave() {
    if(!this.to.isSelected() && !this.from.isSelected()) {
      this.enableFragment(false);
    }
  }

  onSelectedEnter() {
    this.highlightFragment();

    // show hide connected nodes on highlighting factory
    // this.from.makeSolidGeometry();
    // this.to.makeSolidGeometry();
  }

  onSelectedLeave() {
    this.highlightFragment(false);

    // hide connected nodes on highlighting factory
    // this.from.makeSolidGeometry(false);
    // this.to.makeSolidGeometry(false);
  }


  enableFragment(enabled=true) {
    this.scene.lineFactory.enableFragment(this.id, enabled);
  }

  highlightFragment(highlighted=true) {
    this.scene.lineFactory.highlightFragment(this.id, highlighted);
  }

  calculatePath() {
    const fromPos = this.from.getPosition();
    const toPos = this.to.getPosition();

    if(!fromPos || !toPos) {
      this.path = undefined;

    } else {
      this.path = ConnectionGrid.getPath({
        fromX: fromPos.x,
        fromY: -fromPos.z, //connectionGrid uses positive z space, so invert
        toX: toPos.x,
        toY: -toPos.z
      });
    }
  }

  render() {
    this.scene.lineFactory.removeFragment(this.id);

    if(!this.path) {
      return;
    }

    this.points = this.calculateVertices(-0.01);
    this.scene.lineFactory.addFragment({
      id: this.id,
      points: this.points,
      highlightColor
    });

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
    this.postProcessPoints(points);
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

  postProcessPoints(points) {
    const pathLength = points.length;
    const first = points[0];
    const second = points[1];
    const beforeLast = points[pathLength - 2];
    const last = points[pathLength - 1];
    const dirFirstToSecond = this.getDirectionForPoints(first, second);
    const dirlastToBeforeLast = this.getDirectionForPoints(last, beforeLast);

    //caps the first and last line of the connection. nodes have a size of 1 and
    //normally the connection goes from center (0.5, 0.5) to center. with this
    //capping it begins on the edge of the first and ends on the edge of the
    //last node. to get the right of the four possible we need the direction
    //directions are normalized so you can multiply with 0.5
    first.x += dirFirstToSecond.x * 0.5;
    first.y += dirFirstToSecond.y * 0.5;
    first.z += dirFirstToSecond.z * 0.5;

    last.x += dirlastToBeforeLast.x * 0.5;
    last.y += dirlastToBeforeLast.y * 0.5;
    last.z += dirlastToBeforeLast.z * 0.5;
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
    if(this.state === this.states.initial ||
      this.state === this.states.inactive) {
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
    this.changeStateProperty('selected', true);
  }

  unSelect() {
    this.changeStateProperty('selected', false);
  }

  show() {
    this.changeStateProperty('mouseOver', true);
  }

  hide() {
    this.changeStateProperty('mouseOver', false);
  }

  onHighlight(highlighted) {
    if(highlighted && !this.isMouseOver) {
      this.isMouseOver = true;
      this.scene.lineFactory.addFragment({id: this.id, highlightColor: mouseOverColor});
      this.scene.renderScene();

    } else if(!highlighted && this.isMouseOver) {
      this.isMouseOver = false;
      this.scene.lineFactory.addFragment({id: this.id, highlightColor});
      this.scene.renderScene();
    }
  }

  updateOfVisualComponents() {
    if(this.isSelected() || this.isHighlighted()) {
      this.calculatePath();
      this.render();
      this.reEnterState();
    }
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

    this.from.removeConnection(this);
    this.to.removeIncomingConnection(this);

    this.scene.lineFactory.removeFragment(this.id);
    super.dispose();
  }
}
