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
    const height = Math.random() * 0.3;

    for (let i = 1; i < this.path.length; i++) {
      const point = this.path[i];
      const lastPoint = this.path[i - 1];

      points.push(new THREE.Vector3(lastPoint[0], height, -lastPoint[1]));
      points.push(new THREE.Vector3(point[0], height, -point[1]));
    }

    factory.addFragment({id: this.id, points, color: orange});
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
