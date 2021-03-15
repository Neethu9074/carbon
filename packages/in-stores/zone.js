/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createZoneObservable from 'in-subscription/zone';
import { timeConfig$ } from 'in-stores/time/config';

export function getZone(snapshotId, time) {
  if (time) {
    return createZoneObservable({ snapshotId, time });
  }
  return timeConfig$.flatMap(timeConfig => createZoneObservable({ snapshotId, timeConfig }));
}
