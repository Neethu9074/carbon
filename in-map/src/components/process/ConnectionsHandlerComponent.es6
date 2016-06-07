import {DIRECTIONS} from 'in-map/src/3DSceneObjects/common/Connection';
import Connection from 'in-map/src/3DSceneObjects/process/Connection';
import AnimationController from 'in-map/src/AnimationController';

import BaseConnectionsHandlerComponent from '../common/ConnectionsHandlerComponent';
import Bubble from './Bubble';


export default class ConnectionsHandlerComponent extends BaseConnectionsHandlerComponent {

  constructor({sceneObject}) {
    super({sceneObject, id: '_processConnectionsHandler'});

    this.bubbles = [];

    this.animationController = new AnimationController({
      onUpdate: this.updateAnimation.bind(this),
      timeToAnimate: 2000,
      repeat: true
    });
  }

  createNewConnection(config) {
    return new Connection(config);
  }

  getFactory(name) {
    return this.sceneObject.getFactory(name);
  }

  setupBubbles() {
    const connections = this.connections;
    connections.forEach(connection => {
      this.bubbles.push(new Bubble({
        scene: this.sceneObject.scene,
        from: connection.direction === DIRECTIONS.OUT ? connection.sourceNode : connection.destinationNode,
        to: connection.direction === DIRECTIONS.OUT ? connection.destinationNode : connection.sourceNode
      }));
    });
  }

  startAnimation() {
    this.setupBubbles();
    this.animationController.start();
  }

  stopAnimation() {
    this.animationController.stop();
    this.bubbles.forEach(bubble => bubble.dispose());
    this.bubbles = [];
  }

  updateAnimation(v) {
    this.bubbles.forEach(bubble => bubble.update(v));
    this.sceneObject.scene.renderScene();
  }

  dispose() {
    super.dispose();
  }
}
