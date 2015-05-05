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
      channel: opts.pluginId
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

    // After a reconnect we should discard all previously gathered values,
    // as we are getting a full update!
    this.reconnectSubscription = connection.emitter.on('connected')
      .subscribe(() => this.snapshots = null);

    connection.subscribe(this.id, this.subscribeEvent);
  }

  handleMessage(message) {
    if (this.snapshots === null) {
      this.snapshots = Immutable.fromJS(message.online);
      this.onNext(this.snapshots);
      return;
    }

    this.snapshots.withMutations(snapshots => {
      // handle removed values
      snapshots = snapshots.filter(snapshot => {
        return !containsSnapshot(snapshot, message.removed);
      });

      // handle edited and new values
      // easy way: Remove those items that have changed and add them to the end
      snapshots = snapshots.filter(snapshot => {
        return !containsSnapshot(snapshot, message.online);
      });
      snapshots = snapshots.concat(Immutable.fromJS(message.online));

      this.snapshots = snapshots;
      this.onNext(snapshots);
    });
  }

  stop() {
    this.subscription.dispose();
    this.reconnectSubscription.dispose();
    connection.unsubscribe(this.id);
    this.snapshots = null;
  }

}


function containsSnapshot(immutableSnapshot, mutableSnapshots) {
  for (let i = 0, len = mutableSnapshots.length; i < len; i++) {
    const mutableSnapshot = mutableSnapshots[i];
    if (immutableSnapshot.get('hostId') === mutableSnapshot.hostId &&
        immutableSnapshot.get('pluginId') === mutableSnapshot.pluginId &&
        immutableSnapshot.get('steadyId') === mutableSnapshot.steadyId) {
      return true;
    }
  }
  return false;
}
