import Immutable from 'immutable';

import {create} from '../conveyer';
import SnapshotConveyer from '../conveyer/SnapshotConveyer';
import _getIdString from './getIdString';

/**
 * Turns the snapshot into an ID string which can be used as a key in
 * Objects.
 *
 * @param {Immutable.Map} s The snapshot
 * @returns {string} An ID string
 */
export const getIdString = _getIdString;

/**
 * Extract an ID triplet from a snapshot. This method encapsulates what it
 * means to uniquely identify a snapshot.
 *
 * @param {Immutable.Map} snapshot An immutable snapshot from which the ID
 *   part should be extracted, i.e. hostId, pluginId and steadyId.
 * @returns {Immutable.Map} A map only with the three aforementioed properties.
 */
export function extractCoordinates(snapshot) {
  let id;
  if (Immutable.Map.isMap(snapshot)) {
    id = Immutable.Map({
      id: getIdString(snapshot),
      hostId: snapshot.get('hostId'),
      pluginId: snapshot.get('pluginId'),
      steadyId: snapshot.get('steadyId')
    });
  } else {
    id = Immutable.Map({
      id: getIdString(snapshot),
      hostId: snapshot.hostId,
      pluginId: snapshot.pluginId,
      steadyId: snapshot.steadyId
    });
  }

  /* eslint-disable max-len */
  // Snapshot IDs are considered equal when they have the same
  // hostId, pluginId and steadyId. By adding this equal function
  // we can make use Immutable.is' special behavior: It will use
  // an `equal` method on immutable objects when this method exists!
  // See:
  // https://github.com/facebook/immutable-js/blob/944187e9b4537968f4b688447c55f3af7b0dfd73/src/is.js#L82-L86
  /* eslint-enable max-len */
  id.equal = isIdEqual.bind(null, id);

  return id;
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
  } else if (id1 != null && id2 == null) {
    return false;
  } else if (id1 == null && id2 != null) {
    return false;
  }

  return id1.get('hostId') === id2.get('hostId') &&
    id1.get('pluginId') === id2.get('pluginId') &&
    id1.get('steadyId') === id2.get('steadyId');
}

/**
 * Determines whether both IDs are equal. Extracts only id
 *
 * @param {Immutable.Map} snapshot1
 * @param {Immutable.Map} snapshot2
 * @return {boolean} true when both IDs describe the same snapshot
 */
export function isIdEqualShort(snapshot1, snapshot2) {
  if(snapshot1 === snapshot2) {
    return true;
  } else if (snapshot1 !== null && snapshot2 === null) {
    return false;
  } else if (snapshot1 === null && snapshot2 !== null) {
    return false;
  }

  return snapshot1.get('id') === snapshot2.get('id');
}

/**
 * Retrieve a full snapshot and updates for it. Use this function to look for a
 * single snapshot instead instead of filtering sequences yourself.
 *
 * @param {Immutable.Map} coordinates Coordinates of the snapshot
 *   which should be retrieved
 * @return {ReactiveObservable<ImmutableSnapshot>}
 */
export function getFullSnapshot(coordinates) {
  return create(SnapshotConveyer, {coordinates});
}
