'use strict';

import {selectedSnapshot} from './selectedSnapshot';
import {getWiredSnapshots} from 'instana-ui-sdk/snapshot';

import * as ro from 'reactive-observables';


// okay the idea is to subscribe to selectedSnapshotStore
// to get the latest selected snapshot. with that snapshot we call the sdk to
// get all relevant observerables that are wired in any way to the selected
// snapshot. then we subscribe to all of that wired snapshots and if they
// fire -> we call our listeners that we found wired snapshots


//save the latest selected snapshot so that everybody can subscribe on runtime
//to get wired snapshots
let lastSelectedSnapshot = null;

// all of the subscriptions that are needed to get the wired information
// combined in one observerable
let wiredSnapshotsSubscription = null;

// a flag so that nobody can subscribe to this without restarting it
let started = false;

const roSpec = {
  emitLatestOnSubscribe: true,

  start(observerable) {
    // get wired snapshots of the latest emitted snapshot and subscribe to
    // them. if they emit -> call the listeners
    wiredSnapshotsSubscription = getWiredSnapshots(lastSelectedSnapshot)
      .subscribe(snapshotIds => observerable.emit(snapshotIds));

    started = true;
  },

  stop() {
    wiredSnapshotsSubscription.dispose();
    wiredSnapshotsSubscription = null;
  }
};

export const wiredSnapshots = ro.create(roSpec);

// get the current selected snapshot and start the wiredSnapshot subscription.
// if it is started -> restart it so that everybody gets the newest result.
selectedSnapshot.subscribe((snapshot) => {
  lastSelectedSnapshot = snapshot;

  if(started) {
    roSpec.stop();
    roSpec.start(wiredSnapshots);
  }
});
