'use strict';

import THREE from 'three';
import SceneObject from './SceneObject';
import ConnectionGrid from '../connectionGrid';
import _ from 'lodash';
import {createLogger} from 'instalog';
import {theme} from 'instana-ui-services/theme';
import {hexToRGBNormalized} from 'instana-ui-services/util/colors';
import * as app from '../Scene';
import {getColor} from 'instana-ui-sdk/zones';

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
    //add connection to to as well
    to.addConnection(this);

    connections.push(this);

    if(this.from.selected || this.to.selected) {
      this.to.setupImplicitHighlight();
      this.from.setupImplicitHighlight();
    }
  }

  render() {
    if(!this.path) {
      return;
    }

    const points = this.calculateVertices(-0.01);
    let color = getColor(this.from.parent.id);
    color = color ? hexToRGBNormalized(color) : defaultColor;

    const factory = this.getScene().lineFactory;
    factory.removeFragment(this.id);
    factory.addFragment({id: this.id, points, color});

    //hide this if the parent is hidden
    if(this.parent.hidden) {
      this.hide();
    }
  }

  calculateVertices(height) {
    const points = [];

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
      fromY: -fromPos.z,
      toX: toPos.x,
      toY: -toPos.z
    });

    if(this.path) {
      this.postProcessPath();

      //don't forget to block the positions after calculating the route to avoid
      //crossing connections
      ConnectionGrid.blockPosition(fromPos);
      ConnectionGrid.blockPosition(toPos);
    }
  }

  postProcessPath() {
    const path = this.path;

    const pathLength = path.length;
    const first = {x: path[0][0], y: path[0][1]};
    const second = {x: path[1][0], y: path[1][1]};
    const forLast = {x: path[pathLength - 2][0], y: path[pathLength - 2][1]};
    const last = {x: path[pathLength - 1][0], y: path[pathLength - 1][1]};
    const dir = this.getDirectionForPoints(first, second);
    const dir2 = this.getDirectionForPoints(last, forLast);

    path[0][0] += dir.x * 0.5;
    path[0][1] += dir.y * 0.5;
    path[pathLength - 1][0] += dir2.x * 0.5;
    path[pathLength - 1][1] += dir2.y * 0.5;
  }

  getDirectionForPoints(a, b) {
    const dir = {x: b.x - a.x, y: b.y - a.y};
    const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
    dir.x /= (length);
    dir.y /= (length);

    return dir;
  }

  setBidirectional() {
    this.bidirectional = true;
    this.render();
  }

  highlight(value) {
    if(value) {
      //create the path and add it as a fragment to global factory
      this.render();
      this.to.setupImplicitHighlight();
      this.from.setupImplicitHighlight();

    //hide the connection will end up in removing the fragment from factory
    //don't hide conenctions that are part of a selected host
    } else if(!this.from.selected && !this.to.selected) {
      app.scene.scene.lineFactory.removeFragment(this.id);
      this.to.clearImplicitHighlight();
      this.from.clearImplicitHighlight();
    }
  }

  dispose() {
    this.to.removeConnection(this);
    this.from.removeConnection(this);

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
