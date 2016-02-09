import RoEmitter from 'roemitter';

import BaseSubscriber from './BaseSubscriber';


export default class BaseCameraController extends BaseSubscriber {

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
