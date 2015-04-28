'use strict';

import Immutable from 'immutable';
import {emitter, send} from '../connection';

export class SnapshotConveyer {

  static getUniqueId({pluginId}) {
    return pluginId;
  }

  constructor({pluginId}) {
    this.subscribeEvent = {
      event: 'subscribe',
      data: {
        type: 'snapshot',
        pluginId: pluginId
      }
    };

    const msgEventType = 'snapshot:' + pluginId;

    this.dataEventPredicate = e => e.event === msgEventType;
  }

  start(onNext, onError) {
    this.onNext = onNext;
    this.onError = onError;

    this.subscription = emitter.on('message')
      .filter(this.dataEventPredicate)
      .subscribe(e => {
        onNext(Immutable.fromJS(e));
      });

    send(this.subscribeEvent);
  }

  stop() {
    this.subscription.dispose();
  }

}
