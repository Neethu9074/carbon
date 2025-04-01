/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import createSubscription from 'in-subscription/subscription';
import { Snapshot, TimeConfig } from 'in-types';

interface SnapshotRequest {
  snapshotId: string;
  timeConfig: TimeConfig;
}

// need this so that we recieve a typed result without immutable.
// Makes it easier to know what data is coming back.
const snapshotObservable = createSubscription<SnapshotRequest, Snapshot>({
  eventId: 'subscribe-snapshot',

  getData(subscriptionId, params) {
    return {
      subscriptionId,
      snapshotId: params?.snapshotId,
      timeConfig: params?.timeConfig
    };
  }
});

export default snapshotObservable;
