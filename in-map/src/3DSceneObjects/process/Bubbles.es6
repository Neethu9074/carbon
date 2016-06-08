import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import AnimationController from 'in-map/src/AnimationController';
import Bubble from 'in-map/src/3DSceneObjects/process/Bubble';


export default class Bubbles {

  constructor(connection) {
    this.connection = connection;
    this.bubbles = [];

    this.animationController = new AnimationController({
      onUpdate: this.updateAnimation.bind(this),
      timeToAnimate: 2000,
      repeat: true
    });

    this.setupBubbles();
  }

  setupBubbles() {
    const connection = this.connection;

    this.bubbles.push(new Bubble({
      from: connection.direction === DIRECTIONS.OUT ? connection.sourceNode : connection.destinationNode,
      to: connection.direction === DIRECTIONS.OUT ? connection.destinationNode : connection.sourceNode
    }));
  }

  startAnimation() {
    this.bubbles.forEach(bubble => this.connection.scene.addSceneObject(bubble.getSceneObject()));
    this.animationController.start();
  }

  stopAnimation() {
    this.animationController.stop();
    this.bubbles.forEach(bubble => this.connection.scene.removeSceneObject(bubble.getSceneObject()));
  }

  updateAnimation(v) {
    this.bubbles.forEach(bubble => bubble.update(v));
    this.connection.scene.renderScene();
  }

  dispose() {
    this.animationController.dispose();
    this.stopAnimation();

    this.bubbles.forEach(bubble => bubble.dispose());
    this.bubbles = [];

    this.connection = null;
  }
}
