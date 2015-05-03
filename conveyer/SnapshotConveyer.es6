'use strict';

import Immutable from 'immutable';
import * as connection from '../connection/subscriptionAwareConnection';

export default class SnapshotConveyer {

  static getUniqueId({pluginId}) {
    return 'snapshot:' + pluginId;
  }

  constructor(opts) {
    this.id = SnapshotConveyer.getUniqueId(opts);
    this.subscribeEvent = {
      type: 'snapshot',
      pluginId: opts.pluginId
    };

    this.dataEventPredicate = e => e.event === this.id;

    // initially, there is no data!
    this.snapshots = null;
  }

  start(onNext) {
    this.onNext = onNext;

    this.subscription = connection.emitter.on('message')
      .filter(this.dataEventPredicate)
      .subscribe(e => this.handleMessage(e.data));

    connection.subscribe(this.id, this.subscribeEvent);
  }

  handleMessage(message) {
    if (this.snapshots === null) {
      this.snapshots = Immutable.fromJS(message.new);
      this.onNext(this.snapshots);
      return;
    }
    // TODO handle changes and removal
  }

  stop() {
    this.subscription.dispose();
    connection.unsubscribe(this.id);
    this.snapshots = null;
  }

}
