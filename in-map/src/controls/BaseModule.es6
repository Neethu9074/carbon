import BaseSubscriber from './BaseSubscriber';

export default class BaseModule extends BaseSubscriber {

  constructor(eventEmitter) {
    super();

    this.eventEmitter = eventEmitter;
  }

  dispose() {
    super.dispose();

    this.eventEmitter = null;
  }
}
