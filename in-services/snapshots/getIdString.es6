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
  let pluginId;
  let steadyId;

  if (Immutable.Map.isMap(s)) {
    hostId = s.get('hostId');
    pluginId = s.get('pluginId');
    steadyId = s.get('steadyId');
  } else {
    hostId = s.hostId;
    pluginId = s.pluginId;
    steadyId = s.steadyId;
  }

  if(hostId && pluginId && steadyId) {
    return `${pluginId}#${hostId}#${steadyId}`;
  }
  return undefined;
}
