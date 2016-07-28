import Subscriber from 'in-map/misc/Subscriber';


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
