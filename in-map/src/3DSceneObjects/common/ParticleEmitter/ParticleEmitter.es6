// import THREE from 'three';

import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import AnimationController from 'in-map/src/AnimationController';
import {getDeltaTime} from 'in-map/src/timeCalculations';


export default class ParticleEmitter extends SceneObject {

  constructor({parent, id}) {
    super({parent, id});

    this.animationController = new AnimationController({
      onUpdate: this.animationControllerUpdateCallback.bind(this),
      timeToAnimate: 2000,
      repeat: true
    });

    this.vertices = [];
  }

  setPostition(newPosition) {

  }

  lookAt(position) {

  }

  start() {
    this.animationController.start();
  }

  animationControllerUpdateCallback() {
  }

  stop() {
    this.animationController.stop();
  }

  update() {
    const dt = getDeltaTime();
  }

  dispose() {
    super.dispose();

    this.stop();
    this.animationController.dispose();
  }
}
