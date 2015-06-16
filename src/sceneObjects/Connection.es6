'use strict';

import THREE from 'three';
import SceneObject from './SceneObject';
import ConnectionGrid from '../connectionGrid';
import _ from 'lodash';
import {createLogger} from 'instalog';
import {theme} from 'instana-ui-services/theme';
import * as app from '../Scene';
import {hexToRGBNormalized} from 'instana-ui-services/converters';

const logger = createLogger('ui-map.stickyNote.Connection');
const defaultColor = hexToRGBNormalized(theme.map.colors.connection);
export const connections = [];
let id = 0;


export default class Connection extends SceneObject {

  constructor({parent, from, to}) {
    super({parent});

    const match = _.find(connections, con => {
      return (con.to === from && con.from === to);
    });
    if(match) {
      match.setBidirectional();
      return match;
    }

    this.id = id++;
    this.from = from;
    this.to = to;

    this.calculatePath();

    from.addConnection(this);
    to.addIncomingConnection(this);

    connections.push(this);

    this.render();
  }

  render() {
    if(!this.path) {
      return;
    }

    const points = this.calculateVertices(-0.01);
    const factory = this.getScene().lineFactory;
    factory.removeFragment(this.id);
    factory.addFragment({id: this.id, points, color: defaultColor});

    this.to.setupImplicitHighlight();
    this.from.setupImplicitHighlight();

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

    return points;
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
    const dir = {x: b.x - a.x, y: b.y - a.y};

    //normalize them
    const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
    dir.x /= (length);
    dir.y /= (length);

    return dir;
  }

  setBidirectional() {
    this.bidirectional = true;
  }

  refresh() {
    //render will call setup, so clear it before
    this.from.clearImplicitHighlight();
    this.to.clearImplicitHighlight();

    this.calculatePath();
    this.render();
  }

  dispose() {
    this.from.removeConnection(this);
    this.to.removeIncomingConnection(this);

    this.from.clearImplicitHighlight();
    this.to.clearImplicitHighlight();

    _.remove(connections, con => con.id === this.id);

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
