'use strict';

import THREE from 'three';
import SceneObject from './SceneObject';
import ConnectionGrid from '../connectionGrid';
import _ from 'lodash';

const orange = [0.92, 0.4, 0];
const connections = [];
let id = 0;


export default class Connection extends SceneObject {

  constructor({parent, from, to}) {
    super({parent});

    this.id = id++;
    const found = _.find(connections, con => con.to === from);
    if(found) {
      return found;
    }

    this.from = from;
    this.to = to;

    this.calculatePath();

    //add connection to to as well
    to.addConnection(this);

    connections.push(this);
    this.render();
  }

  render() {
    const scene = this.getScene();
    const factory = scene.lineFactory;
    const points = [];
    const height = -0.4; // Math.random() * 0.3;

    points.push(new THREE.Vector3(this.path[0][0] - 0.5,
      0,
      -this.path[0][1] + 0.5));
    points.push(new THREE.Vector3(this.path[0][0] - 0.5,
      height,
      -this.path[0][1] + 0.5));

    for (let i = 1; i < this.path.length; i++) {
      const point = this.path[i];
      const lastPoint = this.path[i - 1];

      points.push(new THREE.Vector3(
        lastPoint[0] - 0.5,
        height,
        -lastPoint[1] + 0.5));
      points.push(new THREE.Vector3(
        point[0] - 0.5,
        height,
        -point[1] + 0.5));
    }

    const lastIndex = this.path.length - 1;
    points.push(new THREE.Vector3(this.path[lastIndex][0] - 0.5,
      0,
      -this.path[lastIndex][1] + 0.5));
    points.push(new THREE.Vector3(this.path[lastIndex][0] - 0.5,
      height,
      -this.path[lastIndex][1] + 0.5));

    factory.addFragment({id: this.id, points, color: orange});
  }

  calculatePath() {
    const fromPos = this.from.getPosition();
    const toPos = this.to.getPosition();

    ConnectionGrid.clearPosition(fromPos);
    ConnectionGrid.clearPosition(toPos);

    this.path = ConnectionGrid.getPath({
      fromX: fromPos.x,
      fromY: -fromPos.z,
      toX: toPos.x,
      toY: -toPos.z
    });

    ConnectionGrid.blockPosition(fromPos);
    ConnectionGrid.blockPosition(toPos);
  }

  refresh() {
    // this.calculatePath();
    //
    // this.removeSceneObject(this.line);
    // this.line.geometry.dispose();
    // this.render();
  }

  dispose() {
    this.to.removeConnection(this);
    if(this.parent !== null) {
      this.getScene().lineFactory.removeFragment(this.id);
    }

    _.remove(connections, con => con === this);

    super.dispose();
  }
}
