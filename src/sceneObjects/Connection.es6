'use strict';

import THREE from 'three';
import SceneObject from './SceneObject';
import ConnectionGrid from '../connectionGrid';
import _ from 'lodash';
import {createLogger} from 'instalog';
import {theme} from 'instana-ui-services/theme';
import * as app from '../Scene';
import {getColor} from 'instana-ui-sdk/zones';

const logger = createLogger('ui-map.stickyNote.Connection');
const connection = new THREE.Color(theme.map.colors.connection);
const defaultColor = [connection.r, connection.g, connection.b];
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

    //add connection to to as well
    to.addConnection(this);
    from.addConnection(this);

    connections.push(this);
    this.render();
  }

  render() {
    if(!this.path) {
      return;
    }

    const points = this.calculateVertices(-0.4);
    let color = getColor(this.from.parent.id);
    color = color ? this.hexToArray(color) : defaultColor;

    const factory = this.getScene().lineFactory;
    factory.removeFragment(this.id);
    factory.addFragment({id: this.id, points, color});

    //hide this if the parent is hidden
    if(this.parent.hidden) {
      this.hide();
    }
  }

  hexToArray(color) {
    color = new THREE.Color(color);
    return [color.r, color.g, color.b];
  }

  calculateVertices(height) {
    const points = [];

    this.addBeginning(points, this.path, height);
    for (let i = 1; i < this.path.length; i++) {
      const point = this.path[i];
      const lastPoint = this.path[i - 1];

      points.push(new THREE.Vector3(lastPoint[0], height, -lastPoint[1]));
      points.push(new THREE.Vector3(point[0], height, -point[1]));
    }
    this.addEnding(points, this.path, height);

    return points;
  }

  addBeginning(points, path, height) {
    const firstPointX = path[0][0];
    const firstPointZ = -path[0][1];
    points.push(new THREE.Vector3(firstPointX, 0, firstPointZ));
    points.push(new THREE.Vector3(firstPointX, height, firstPointZ));

    if(this.bidirectional) {
      points.push(new THREE.Vector3(firstPointX, 0, firstPointZ));
      points.push(new THREE.Vector3(firstPointX + 0.1, -0.25, firstPointZ));

      points.push(new THREE.Vector3(firstPointX, 0, firstPointZ));
      points.push(new THREE.Vector3(firstPointX - 0.1, -0.25, firstPointZ));
    }
  }

  addEnding(points, path, height) {
    const lastIndex = path.length - 1;
    const lastPoint = path[lastIndex];
    const lastPointPos = new THREE.Vector3(
      lastPoint[0], 0, -lastPoint[1]);

    points.push(lastPointPos);
    points.push(new THREE.Vector3(
      lastPoint[0], height, lastPointPos.z));

    points.push(lastPointPos);
    points.push(new THREE.Vector3(
      lastPoint[0] - 0.1, -0.25, lastPointPos.z));

    points.push(lastPointPos);
    points.push(new THREE.Vector3(
      lastPoint[0] + 0.1, -0.25, lastPointPos.z));
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
      const movement = (Math.random() * 0.2) - 0.2;
      for (let i = 0; i < this.path.length; i++) {
        this.path[i][0] += movement;
      }
    }

    //dont forget to block the positions after calculating the route to avoid
    //crossing connections
    ConnectionGrid.blockPosition(fromPos);
    ConnectionGrid.blockPosition(toPos);
  }

  setBidirectional() {
    this.bidirectional = true;
    this.render();
  }

  show() {
    super.show();
    this.enableFragment(true);
  }

  highlight(value) {
    this.getScene().lineFactory.highlightFragment(this.id, value);
  }

  hide() {
    super.hide();
    this.enableFragment(false);
  }

  enableFragment(enabled) {
    this.getScene().lineFactory.enableFragment(this.id, enabled);
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
