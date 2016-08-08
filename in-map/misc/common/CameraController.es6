import RoEmitter from 'roemitter';

import {setCameraController} from 'in-map/stores/cameraController';
import Subscriber from 'in-map/src/Subscriber';


export default class CameraController extends Subscriber {

  constructor() {
    super();

    this.interactionModules = [];
    this.eventEmitter = new RoEmitter('control event emitter');

    setCameraController(this);
  }

  dispose() {
    this.interactionModules.forEach(module => module.dispose());
    this.interactionModules = [];

    this.eventEmitter.dispose();
    super.dispose();

    setCameraController(null);
  }
}
