// Extract from snapshots.es6 to avoid circular dependencies between
// snapshots, SnapshotConveyer and SnapshotsConveyer

import Immutable from 'immutable';

/**
 * Turns the snapshot into an ID string which can be used as a key in
 * Objects.
 *
 * @param {Immutable.Map} s The snapshot
 * @returns {string} An ID string
 */
export default function getIdString(s) {
  let hostId;
  let plugin;
  let steadyId;

  if (Immutable.Map.isMap(s)) {
    hostId = s.get('hostId');
    plugin = s.get('plugin');
    steadyId = s.get('steadyId');
  } else {
    hostId = s.hostId;
    plugin = s.plugin;
    steadyId = s.steadyId;
  }

  if (hostId && plugin && steadyId) {
    return `${plugin}#${hostId}#${steadyId}`;
  }
  return undefined;
}
