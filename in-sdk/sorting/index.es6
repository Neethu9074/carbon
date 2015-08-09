

import {createLogger} from 'instalog';

const logger = createLogger('in-sdk.sorting');

const comparators = {};

export function addMapping(pluginId, comparator) {
  if (pluginId in comparators) {
    logger.info(
      'Duplicated comparator registration for pluginId' + pluginId
    );
    return;
  }
  comparators[pluginId] = comparator;
}

export function sort(snapshots) {
  if (snapshots.size === 0) {
    return snapshots;
  }

  const pluginId = snapshots.get(0).get('pluginId');
  const comparator = comparators[pluginId];
  if (!comparator) {
    const msg = 'No sorter for pluginId ' + pluginId + ' found.';
    logger.error(msg);
    throw new Error(msg);
  }
  return snapshots.sort(comparator);
}
