import Subscriber from './Subscriber';


export default class Module extends Subscriber {

  constructor(eventEmitter) {
    super();

    this.eventEmitter = eventEmitter;
  }

  dispose() {
    super.dispose();

    this.eventEmitter = null;
  }
}
