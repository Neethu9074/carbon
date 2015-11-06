import Immutable from 'immutable';
import invariant from 'invariant';

import * as connection from '../connection/subscriptionAwareConnection';
import getIdString from '../snapshots/getIdString';

export default class SnapshotsConveyer {

  static getUniqueId({pluginId}) {
    return 'snapshots:' + pluginId;
  }

  constructor({pluginId}) {
    invariant(pluginId, 'A pluginId is required in order to retrieve snapshots');

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
    this.onNext = onNext;

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
    message.data.forEach(mutableSnapshot => {
      mutableSnapshot.id = getIdString(mutableSnapshot);

      mutableSnapshot.tags = mutableSnapshot.processorTags || [];
      delete mutableSnapshot.processorTags;
    });

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
    let hasChanges = false;
    if (this.snapshots) {
      message.data.forEach(presenceMessage => {
        if (!presenceMessage.data.online) {
          const id = getIdString(presenceMessage);
          this.snapshots = this.snapshots.filter(snapshot => {
            const isOnline = snapshot.get('id') !== id;
            hasChanges = hasChanges || !isOnline;
            return isOnline;
          });
        }
      });
    }
    if (hasChanges) {
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
  const id = immutableSnapshot.get('id');
  for (let i = 0, len = mutableSnapshots.length; i < len; i++) {
    const mutableSnapshot = mutableSnapshots[i];
    if (id === mutableSnapshot.id) {
      return true;
    }
  }
  return false;
}
