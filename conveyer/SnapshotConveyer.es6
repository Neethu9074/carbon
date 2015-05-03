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

    this.snapshots.withMutations(snapshots => {
      // handle new values
      snapshots = snapshots.concat(Immutable.fromJS(message.new));

      // handle removed values
      snapshots = snapshots.filter(snapshot => {
        return !containsSnapshot(snapshot, message.removed);
      });

      // handle edited values
      // easy way: Remove those items that have changed and add them to the end
      snapshots = snapshots.filter(snapshot => {
        return !containsSnapshot(snapshot, message.changed);
      });
      snapshots = snapshots.concat(Immutable.fromJS(message.changed));

      this.snapshots = snapshots;
      this.onNext(snapshots);
    });
  }

  stop() {
    this.subscription.dispose();
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
