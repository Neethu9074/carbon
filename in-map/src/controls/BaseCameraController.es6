import RoEmitter from 'roemitter';

import BaseSubscriber from './BaseSubscriber';

export default class BaseCameraController extends BaseSubscriber {

  constructor() {
    super();

    this.eventEmitter = new RoEmitter('control event emitter');
  }

  dispose() {
    this.eventEmitter.dispose();

    super.dispose();
  }
}
