import {createLogger} from 'instalog';

const logger = createLogger('in-sdk.sorting');

const comparators = {};

export function addMapping(plugin, comparator) {
  if (plugin in comparators) {
    logger.info(
      'Duplicated comparator registration for plugin' + plugin
    );
    return;
  }
  comparators[plugin] = comparator;
}

export function sort(snapshots) {
  if (snapshots.size === 0) {
    return snapshots;
  }

  const plugin = snapshots.get(0).get('plugin');
  const comparator = comparators[plugin];
  if (!comparator) {
    const msg = 'No sorter for plugin ' + plugin + ' found.';
    logger.error(msg);
    throw new Error(msg);
  }
  return snapshots.sort(comparator);
}
