import {combineLatest} from 'reactive-observables';
import THREE from 'three';

import {getColorPool} from 'in-services/util/ColorGenerator';
import {getSnapshot} from 'in-stores/snapshot';

import BaseConnection from './BaseConnection';


export const allConnections = [];

export default class ProcessConnection extends BaseConnection {

  constructor(params) {
    super(params);
    this.addSubscription(
      combineLatest([
        getSnapshot(this.sourceNode.id),
        getSnapshot(this.destinationNode.id)
      ])
      .subscribe(snapshots => this.setColorFromSnapshots(snapshots[0], snapshots[1]))
    );
  }

  getMaterial() {
    return new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors,
      visible: false,
      linewidth: 2
    });
  }

  calculatePath(fromPos, toPos) {
    return [
      fromPos,
      toPos
    ];
  }

  postProPath(path) {
    path.forEach(point => {
      point.x -= 0.5;
      point.z += 0.5;
    });
    return path;
  }

  setColorFromSnapshots(sourceSnapshot, destinationSnapshot) {
    const colorPool = getColorPool('processes');
    const sourceColor = colorPool.getColorRGB(sourceSnapshot.get('plugin'));
    const destinationColor = colorPool.getColorRGB(destinationSnapshot.get('plugin'));
    const color = [
      sourceColor.r, sourceColor.g, sourceColor.b,
      destinationColor.r, destinationColor.g, destinationColor.b
    ];

    this.geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(color), 3));
    this.geometry.attributes.color.needsUpdate = true;
  }

  dispose() {
    super.dispose();
  }
}
