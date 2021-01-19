/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { find } from 'lodash';

import { compare } from 'in-services/util/number';

// Attempt to fix clock skews in user data. Clock skews occur when end-user devices delay transmission
// of some beacons. We cannot reasonably identify what is correct when receiving the data in the backend,
// but we can do this in the UI as we have access to all beacons.
export function fixClockSkewProblems(beacons) {
  const sessionStart = find(beacons, b => b.type === 'sessionStart');
  if (!sessionStart) {
    return { beacons, requiredFixes: false };
  }

  const beaconWithEarliestTimestamp = getBeaconWithEarliestTimestamp(beacons);
  if (beaconWithEarliestTimestamp.timestamp >= sessionStart.timestamp) {
    return { beacons, requiredFixes: false };
  }

  const changedBeacons = beacons
    .map(beacon => ({
      ...beacon,
      clockSkew: 0,
      timestamp: beacon.timestamp - (beacon.clockSkew || 0)
    }))
    .sort((a, b) => compare(a.timestamp, b.timestamp));

  return { beacons: changedBeacons, requiredFixes: true };
}

function getBeaconWithEarliestTimestamp(beacons) {
  return beacons.reduce((minBeacon, beacon) => {
    if (minBeacon == null || beacon.timestamp < minBeacon.timestamp) {
      return beacon;
    }
    return minBeacon;
  }, null);
}
