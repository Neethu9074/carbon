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
  return `${s.get('hostId')}#${s.get('pluginId')}#${s.get('steadyId')}`;
}


/**
 * Extract an array of all found connections as string IPs.
 *
 * @param {Immutable.Map} snapshot An immutable snapshot from which the
 * connection part should be extracted.
 * @returns {Immutable.List<string>} a list with all connections.
 */
export function extractConnections(snapshot) {
  const connectionMap = snapshot.getIn(['snapshot', 'connections']);
  if(connectionMap) {
    return connectionMap.map(connection => {
      return connection;
    });
  }

  return [];
}
