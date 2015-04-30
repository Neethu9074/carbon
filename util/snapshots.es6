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
 * Build a predicate function using the given snapshot ID
 *
 * @param {Immutable.Map} id A snapshot ID definition as defined by extractId.
 * @return {Function} A function that takes an Immutable snapshot and returns
 *   true when the ID matches.
 */
export function getIdPredicate(id) {
  return snapshot => {
    return snapshot.get('hostId') === id.get('hostId') &&
      snapshot.get('pluginId') === id.get('pluginId') &&
      snapshot.get('steadyId') === id.get('steadyId');
  };
}
