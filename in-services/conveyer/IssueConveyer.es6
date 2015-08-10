import Immutable from 'immutable';

import * as connection from '../connection/subscriptionAwareConnection';


export default class IssueConveyer {

  static getUniqueId({timeframe}) {
    return 'issue,' + timeframe;
  }

  constructor({timeframe}) {
    this.id = connection.getSubscriptionId();
    this.subscribeEvent = {
      id: this.id,
      event: 'subscribe',
      type: 'issue',
      timeframe
    };
  }

  start(onNext) {
    this.subscription = connection.emitter.on('message')
      .filter(e => e.id === this.id)
      .subscribe(e => onNext(Immutable.fromJS(e.data)));

    connection.subscribe(this.id, this.subscribeEvent);
  }

  stop() {
    this.subscription.dispose();
    connection.unsubscribe(this.id);
  }

}
