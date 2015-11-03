import * as connection from '../connection/subscriptionAwareConnection';

export default class RawPayloadConveyer {

  static getUniqueId({coordinates, name}) {
    return 'raw_payload,' + coordinates.get('id') + ',' + name;
  }

  constructor({coordinates, name}) {
    this.id = connection.getSubscriptionId();
    this.subscribeEvent = {
      id: this.id,
      event: 'subscribe',
      type: 'raw_payload',
      name,
      hostId: coordinates.get('hostId'),
      pluginId: coordinates.get('pluginId'),
      steadyId: coordinates.get('steadyId')
    };
  }

  start(onNext) {
    this.subscription = connection.emitter.on('message')
      .filter(e => e.id === this.id)
      .subscribe(onNext);

    connection.subscribe(this.id, this.subscribeEvent);
  }

  stop() {
    this.subscription.dispose();
    connection.unsubscribe(this.id);
  }

}
