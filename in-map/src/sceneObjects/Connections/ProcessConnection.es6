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
       combineLatest([getSnapshot(this.sourceNode.id), getSnapshot(this.destinationNode.id)])
      .subscribe(snapshots => this.setColorFromSnapshots(snapshots[0], snapshots[1]))
    );

    this.scene.addSceneObject(this.mesh);
  }

  setupGeometry() {
    // represents the geometry for all combined fragments
    this.geometry = new THREE.BufferGeometry();
    this.geometry.dynamic = true;

    this.material = new THREE.LineBasicMaterial({
      vertexColors: THREE.VertexColors,
      linewidth: 2
    });

    // a global mesh that stores global geometry
    const mesh = this.mesh = new THREE.LineSegments(this.geometry, this.material);
    mesh.rotationAutoUpdate = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    mesh.renderOrder = 2;
  }

  updateGeometry() {
    this.geometry.addAttribute('position',
      new THREE.BufferAttribute(
        new Float32Array(this.getLineVertices(this.sourceNode, this.destinationNode)), 3));

    this.geometry.attributes.position.needsUpdate = true;
  }

  calculatePath(fromPos, toPos) {
    fromPos.x -= 0.5;
    fromPos.z += 0.5;
    toPos.x -= 0.5;
    toPos.z += 0.5;

    return [fromPos, toPos];
  }

  postProPath(path) {
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
