import Subscriber from 'in-map/src/Subscriber';


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
