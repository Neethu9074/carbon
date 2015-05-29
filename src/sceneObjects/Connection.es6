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
    const found = _.find(connections, con => {
      return (con.to === from && con.from === to);
    });
    if(found) {
      found.setBidirectional();
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
    const height = -0.4;

    this.addBeginning(points, this.path, height);
    for (let i = 1; i < this.path.length; i++) {
      const point = this.path[i];
      const lastPoint = this.path[i - 1];

      points.push(new THREE.Vector3(
        lastPoint[0] - 0.5, height, -lastPoint[1] + 0.5));
      points.push(new THREE.Vector3(
        point[0] - 0.5, height, -point[1] + 0.5));
    }
    this.addEnding(points, this.path, height);

    factory.removeFragment(this.id);
    factory.addFragment({id: this.id, points, color: orange});
  }

  addBeginning(points, path, height) {
    const firstPointX = path[0][0] - 0.5;
    const firstPointZ = -path[0][1] + 0.5;
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
      lastPoint[0] - 0.5, 0, -lastPoint[1] + 0.5);

    points.push(lastPointPos);
    points.push(new THREE.Vector3(
      lastPoint[0] - 0.5, height, lastPointPos.z));

    points.push(lastPointPos);
    points.push(new THREE.Vector3(
      lastPoint[0] - 0.6, -0.25, lastPointPos.z));

    points.push(lastPointPos);
    points.push(new THREE.Vector3(
      lastPoint[0] - 0.4, -0.25, lastPointPos.z));
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

    const movement = (Math.random() * 0.2) - 0.2;
    for (let i = 0; i < this.path.length; i++) {
      this.path[i][0] += movement;
    }

    //dont forget to block the positions after calculating the route to avoid
    //crossing connections
    ConnectionGrid.blockPosition(fromPos);
    ConnectionGrid.blockPosition(toPos);
  }

  refresh() {
    //console.log('refresh');
  }

  setBidirectional() {
    this.bidirectional = true;
    this.render();
  }

  dispose() {
    this.to.removeConnection(this);

    try{
      this.getScene().lineFactory.removeFragment(this.id);
    } catch(err) {
      //this parent was already disposed and the line isn't visible anymore
      //happens on bidirectional connections
      // if(!this.bidirectional) {
      //   console.log('cant destroy this', this.bidirectional, this);
      // }
      this.parent = null;
    }
    _.remove(connections, con => con === this);

    super.dispose();
  }
}
