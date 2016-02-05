import {DIRECTIONS} from 'in-map/src/SceneObjects/Connections/ConnectionDirections';
import Bubble from 'in-map/src/components/ConnectionsHandlerComponents/Bubble';
import AnimationController from 'in-map/src/AnimationController';

import ProcessConnection from '../../SceneObjects/Connections/ProcessConnection';
import ConnectionsHandlerComponent from './ConnectionsHandlerComponent';


export default class ProcessConnectionsHandlerComponent extends ConnectionsHandlerComponent {

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
    return new ProcessConnection(config);
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
