'use strict';

import Immutable from 'immutable';
import * as connection from '../connection/subscriptionAwareConnection';

export default class NotificationConveyer {

  static getUniqueId() {
    return 'notifications';
  }

  constructor(opts) {
    this.id = NotificationConveyer.getUniqueId(opts);
    this.subscribeEvent = {
      event: 'subscribe',
      type: 'notification'
    };
  }

  start(onNext) {
    this.onNext = onNext;

    this.subscription = connection.emitter.on('message')
      .subscribe(e => onNext(Immutable.fromJS(e)));

    connection.subscribe(this.id, this.subscribeEvent);
  }

  stop() {
    this.subscription.dispose();
    connection.unsubscribe(this.id);
  }

}
