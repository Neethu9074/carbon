import THREE from 'three';


export default class Bubble {

  constructor({scene, from, to}) {
    this.from = from;
    this.to = to;
    this.scene = scene;

    const fromPos = from.getComponent('position').getPosition();

    this.bubble = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10));
    this.bubble.position.set(fromPos.x - 0.5, fromPos.y, fromPos.z + 0.5);
    this.scene.addSceneObject(this.bubble);
  }

  update(v) {
    const fromPos = this.from.getComponent('position').getPosition().clone();
    const toPos = this.to.getComponent('position').getPosition().clone();

    // don't store the direction since nodes position can change
    const dir = toPos.sub(fromPos);

    const newPos = fromPos.add(dir.multiplyScalar(v));
    this.bubble.position.set(newPos.x - 0.5, newPos.y, newPos.z + 0.5);
  }

  dispose() {
    this.scene.removeSceneObject(this.bubble);
  }
}
