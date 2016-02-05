import {combineLatest} from 'reactive-observables';
import THREE from 'three';

import {getColorPool} from 'in-services/util/ColorGenerator';
import {getSnapshot} from 'in-stores/snapshot';


const white = {r: 1, g: 1, b: 1};

export default class Bubble {

  constructor({scene, from, to}) {
    this.from = from;
    this.to = to;
    this.scene = scene;

    this.fromColor = this.toColor = white;

    // subscribe to both snapshots to caluclate the color gradient between source and destination
    this.snapshotSubscriptions = combineLatest([getSnapshot(this.from.id), getSnapshot(this.to.id)])
      .subscribe(snapshots => this.setColorFromSnapshots(snapshots[0], snapshots[1]));

    const fromPos = from.getComponent('position').getPosition();

    this.bubble = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff }));
    this.bubble.position.set(fromPos.x - 0.5, fromPos.y, fromPos.z + 0.5);
    this.scene.addSceneObject(this.bubble);
  }

  setColorFromSnapshots(fromSnapshot, toSnapshot) {
    const colorPool = getColorPool('processes');
    this.fromColor = colorPool.getColorRGB(fromSnapshot.get('plugin'));
    this.toColor = colorPool.getColorRGB(toSnapshot.get('plugin'));
  }

  update(v) {
    const fromPos = this.from.getComponent('position').getPosition().clone();
    const toPos = this.to.getComponent('position').getPosition().clone();

    // don't store the direction since nodes position can change
    const dir = toPos.sub(fromPos);

    const newPos = fromPos.add(dir.multiplyScalar(v));
    this.bubble.position.set(newPos.x - 0.5, newPos.y, newPos.z + 0.5);
    this.bubble.material.color.setRGB(
      this.fromColor.r + ((this.toColor.r - this.fromColor.r) * v),
      this.fromColor.g + ((this.toColor.g - this.fromColor.g) * v),
      this.fromColor.b + ((this.toColor.b - this.fromColor.b) * v)
    );
  }

  dispose() {
    this.scene.removeSceneObject(this.bubble);

    this.snapshotSubscriptions.dispose();
    this.snapshotSubscriptions = null;

    this.bubble.geometry.dispose();
    this.bubble.material.dispose();

    this.to = null;
    this.from = null;
    this.scene = null;
    this.bubble = null;
    this.toColor = null;
    this.fromColor = null;
  }
}
