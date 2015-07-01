'use strict';

import Immutable from 'immutable';


/**
 * Extract an ID triplet from a snapshot. This method encapsulates what it
 * means to uniquely identify a snapshot.
 *
 * @param {Immutable.Map} snapshot An immutable snapshot from which the ID
 *   part should be extracted, i.e. hostId, pluginId and steadyId.
 * @returns {Immutable.Map} A map only with the three aforementioed properties.
 */
export function extractId(snapshot) {
  /* eslint-disable new-cap */
  return Immutable.Map({
    hostId: snapshot.get('hostId'),
    pluginId: snapshot.get('pluginId'),
    steadyId: snapshot.get('steadyId')
  });
  /* eslint-enable new-cap */
}

/**
 * Determines whether both IDs are equal.
 *
 * @param {Immutable.Map} id1
 * @param {Immutable.Map} id2
 * @return {boolean} true when both IDs describe the same snapshot, i.e.
 *  the hostId, pluginId and steadyId property are the same.
 */
export function isIdEqual(id1, id2) {
  if(id1 === id2) {
    return true;
  } else if (id1 !== null && id2 === null) {
    return false;
  } else if (id1 === null && id2 !== null) {
    return false;
  }

  return id1.get('hostId') === id2.get('hostId') &&
    id1.get('pluginId') === id2.get('pluginId') &&
    id1.get('steadyId') === id2.get('steadyId');
}

/**
 * Turns the snapshot into an ID string which can be used as a key in
 * Objects.
 *
 * @param {Immutable.Map} s The snapshot
 * @returns {string} An ID string
 */
export function getIdString(s) {
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
    return `${hostId}#${pluginId}#${steadyId}`;
  }
  return undefined;
}

/**
 * Look for a snapshot in an reactive observable. Commonly used to extract a
 * single snapshot out of a conveyer.
 *
 * @param {ReactiveObservable<Collection<ImmutableSnapshot>>} observable
 *   The data in which to look for the snapshotId
 * @param {ImmutableSnapshotId} snapshotId The snapshot for which to look
 * @param {ReactiveObservable<ImmutableSnapshot>} An observable which only
 *   emits when the snapshot is found and when the snapshot changed.
 */
export function only(observable, snapshotId) {
  const predicate = isIdEqual.bind(null, snapshotId);

  return observable.map(snapshots => {
    return snapshots.find(predicate, null, undefined);
  })
  .filter(v => v !== undefined)
  .distinct();
}
