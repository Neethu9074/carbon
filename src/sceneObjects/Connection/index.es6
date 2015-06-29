'use strict';

import THREE from 'three';
import SceneObject from '../SceneObject';
import ConnectionGrid from '../../connectionGrid';
import _ from 'lodash';
import {theme} from 'instana-ui-services/theme';
import * as app from '../../Scene';
import {setupStates} from './States/index';
import {createLogger} from 'instalog';

const logger = createLogger('ui-map.stickyNote.Connection');
let id = 0;


export default class Connection extends SceneObject {

  constructor({parent, from, to, direction}) {
    super({parent});

    this.id = id++;
    this.from = from;
    this.to = to;
    this.direction = direction;

    this.calculatePath();

    from.addConnection(this);
    to.addIncomingConnection(this);

    this.render();
  }

  initStates() {
    return setupStates(this);
  }

  render() {
    if(!this.path) {
      return;
    }

    const points = this.calculateVertices(-0.01);
    const factory = this.getScene().lineFactory;
    const isSelected = this.parent.isSelected;

    factory.removeFragment(this.id);
    factory.addFragment({
      id: this.id, points, highlighted: isSelected
    });

    this.to.highlighting.setIndirectHighlight(isSelected);
    this.from.highlighting.setIndirectHighlight(isSelected);

    //hide this if the parent is hidden
    if(this.parent.hidden) {
      this.hide();
    }
    this.visible = true;
  }

  calculateVertices(height) {
    const points = [];

    //vertices have to be calculated in the following order:
    //[ p0, p1, p1, p2, p2, p3, ... ] the reason is that we use lineparts and
    //openGL is drawing the lines in this order
    for (let i = 1; i < this.path.length; i++) {
      const point = this.path[i];
      const lastPoint = this.path[i - 1];

      points.push({
        x: lastPoint[0] - 0.5,
        y: height,
        z: -lastPoint[1] + 0.5
      });
      points.push({
        x: point[0] - 0.5,
        y: height,
        z: -point[1] + 0.5
      });
    }

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

  calculatePath() {
    const fromPos = this.from.getPosition();
    const toPos = this.to.getPosition();

    //set the postions of source and dest to walkable, because you want to
    //find a route between them
    ConnectionGrid.clearPosition(fromPos);
    ConnectionGrid.clearPosition(toPos);

    this.path = ConnectionGrid.getPath({
      fromX: fromPos.x,
      fromY: -fromPos.z, //connectionGrid uses positive z space, so invert
      toX: toPos.x,
      toY: -toPos.z
    });

    if(this.path) {
      this.postProcessPath();

      //don't forget to block the positions after calculating the path to avoid
      //crossing connections. only block if there is a valid path
      ConnectionGrid.blockPosition(fromPos);
      ConnectionGrid.blockPosition(toPos);
    }
  }

  postProcessPath() {
    const path = this.path; //path -> [ [x, y], [x2, y2], ... ]
    const pathLength = path.length;
    const first = {x: path[0][0], y: path[0][1]};
    const second = {x: path[1][0], y: path[1][1]};
    const beforeLast = {x: path[pathLength - 2][0], y: path[pathLength - 2][1]};
    const last = {x: path[pathLength - 1][0], y: path[pathLength - 1][1]};
    const dirFirstToSecond = this.getDirectionForPoints(first, second);
    const dirlastToBeforeLast = this.getDirectionForPoints(last, beforeLast);

    //caps the first and last line of the connection. nodes have a size of 1 and
    //normally the connection goes from center (0.5, 0.5) to center. with this
    //capping it begins on the edge of the first and ends on the edge of the
    //last node. to get the right of the four possible we need the direction
    //directions are normalized so you can multiply with 0.5
    path[0][0] += dirFirstToSecond.x * 0.5;
    path[0][1] += dirFirstToSecond.y * 0.5;
    path[pathLength - 1][0] += dirlastToBeforeLast.x * 0.5;
    path[pathLength - 1][1] += dirlastToBeforeLast.y * 0.5;
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

  select() {
    const scene = this.getScene();

    scene.lineFactory.highlightFragment(this.id, true);
    scene.lineFactory.highlightFragment(this.to.id, true);
    scene.lineFactory.highlightFragment(this.from.id, true);
    scene.renderScene();
  }

  unSelect() {
    const scene = this.getScene();

    scene.lineFactory.highlightFragment(this.id, false);
    scene.lineFactory.highlightFragment(this.to.id, false);
    scene.lineFactory.highlightFragment(this.from.id, false);
    scene.renderScene();
  }

  updateOfVisualComponents() {
    //render() will call setIndirectHighlight, so clear it before
    this.from.highlighting.clearIndirectHighlight();
    this.to.highlighting.clearIndirectHighlight();

    this.calculatePath();
    this.render();
  }

  dispose() {
    //this connection is done with the implicit highlighting so decrease the
    //counter by calling clearIndirectHighlight
    this.from.highlighting.clearIndirectHighlight();
    this.to.highlighting.clearIndirectHighlight();

    this.from.removeConnection(this);
    this.to.removeIncomingConnection(this);

    try{
      app.scene.scene.lineFactory.removeFragment(this.id);
    } catch(err) {
      //if the parent was still disposed and the connection is not bidirectional
      //(so disposed on the other end) there is something curious
      if(!this.parent || !this.bidirectional) {
        logger.error('cant destroy connection', this, err);
      } else {
        logger.error('there is something curious',
          'parent:', this.parent, 'parent.parent:', this.parent.parent,
          'bidirectional:', this.bidirectional, err);
      }
    }

    super.dispose();
  }
}
