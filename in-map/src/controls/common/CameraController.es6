import RoEmitter from 'roemitter';

import Subscriber from './Subscriber';


export default class CameraController extends Subscriber {

  constructor() {
    super();

    this.interactionModules = [];
    this.eventEmitter = new RoEmitter('control event emitter');
  }

  dispose() {
    this.interactionModules.forEach(module => module.dispose());
    this.interactionModules = [];

    this.eventEmitter.dispose();
    super.dispose();
  }
}
