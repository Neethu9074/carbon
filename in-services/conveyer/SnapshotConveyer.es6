import _ from 'lodash';
import Immutable from 'immutable';

import * as connection from '../connection/subscriptionAwareConnection';

export default class SnapshotConveyer {

  static getUniqueId({pluginId}) {
    return 'snapshot:' + pluginId;
  }

  constructor({pluginId}) {
    this.snapshotId = connection.getSubscriptionId();
    this.presenceId = connection.getSubscriptionId();

    this.snapshotSubscribeEvent = {
      id: this.snapshotId,
      event: 'subscribe',
      type: 'snapshot',
      pluginId
    };
    this.presenceSubscribeEvent = {
      id: this.presenceId,
      event: 'subscribe',
      type: 'presence',
      pluginId
    };

    this.snapshotDataEventPredicate = e => e.id === this.snapshotId;
    this.presenceDataEventPredicate = e => e.id === this.presenceId;

    // initially, there is no data!
    this.snapshots = null;
  }

  start(onNext) {
    this.onNext = _.throttle(onNext, 100);

    this.snapshotSubscription = connection.emitter.on('message')
      .filter(this.snapshotDataEventPredicate)
      .subscribe(e => this.handleSnapshotMessage(e));
    this.presenceSubscription = connection.emitter.on('message')
      .filter(this.presenceDataEventPredicate)
      .subscribe(e => this.handlePresenceMessage(e));

    // After a reconnect we should discard all previously gathered values,
    // as we are getting a full update!
    this.reconnectSubscription = connection.emitter.on('connected')
      .subscribe(() => this.snapshots = null);

    connection.subscribe(this.snapshotId, this.snapshotSubscribeEvent);
    connection.subscribe(this.presenceId, this.presenceSubscribeEvent);
  }

  handleSnapshotMessage(message) {
    if (this.snapshots === null) {
      this.snapshots = Immutable.fromJS(message.data);
      this.onNext(this.snapshots);
      return;
    }

    this.snapshots.withMutations(snapshots => {
      // handle edited and new values
      // easy way: Remove those items that have changed and add them to the end
      snapshots = snapshots.filter(snapshot => {
        return !containsSnapshot(snapshot, message.data);
      });
      snapshots = snapshots.concat(Immutable.fromJS(message.data));

      this.snapshots = snapshots;
      this.onNext(snapshots);
    });
  }

  handlePresenceMessage(message) {
    if (!message.data.online) {
      message.data.forEach(presenceMessage => {
        this.snapshots = this.snapshots.filter(snapshot => {
          return !(snapshot.get('hostId') === presenceMessage.hostId &&
            snapshot.get('steadyId') === presenceMessage.steadyId &&
            snapshot.get('pluginId') === presenceMessage.pluginId);
        });
      });
      this.onNext(this.snapshots);
    }
  }

  stop() {
    this.snapshotSubscription.dispose();
    this.presenceSubscription.dispose();
    this.reconnectSubscription.dispose();
    connection.unsubscribe(this.snapshotId);
    connection.unsubscribe(this.presenceId);
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
