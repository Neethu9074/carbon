'use strict';

import {createLogger} from 'instalog';
const logger = createLogger('ui-services.connection');

import THREE from 'three';
import SceneObject from './SceneObject';
import ConnectionGrid from '../connectionGrid';
import _ from 'lodash';

const material = new THREE.LineBasicMaterial({color: 0xeb6600});
const connections = [];


export default class Connection extends SceneObject {

  constructor({parent, from, to}) {
    super({parent});

    const found = _.find(connections, con =>
      (con.to === from || con.from === from));

    if(found) {
      return found;
    }

    this.from = from;
    this.to = to;

    this.calculatePath();

    from.addConnection(this);
    to.addConnection(this);

    connections.push(this);
    this.render();
  }

  render() {
    const geometry = new THREE.Geometry();
    for (let i = 0; i < this.path.length; i++) {
      geometry.vertices.push(
        new THREE.Vector3(this.path[i][0], 0, -this.path[i][1]));
    }

    const line = new THREE.Line(geometry, material);
    line.position.x -= 0.01;
    line.position.z += 1.01;
    line.position.y = Math.random() * 0.3;
    this.line = line;

    return line;
  }

  calculatePath() {
    const fromPos = this.from.getPosition();
    const toPos = this.to.getPosition();

    this.path = ConnectionGrid.getPath({
      fromX: fromPos.x - 1,
      fromY: -fromPos.z,
      toX: toPos.x - 1,
      toY: -toPos.z
    });
  }

  refresh() {
    logger.log('refresh connection', this);
    //this.line.geometry.dispose();
    //this.calculatePath();
    //this.render();
  }

  dispose() {
    _.remove(connections, con => con === this);

    super.dispose();
    this.parent = null;
  }
}
