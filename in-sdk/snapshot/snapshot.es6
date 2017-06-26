export { registerSnapshotDefinition, getSnapshotDefinition } from 'in-sdk/snapshot/registry';
export { addLabelFinder, getLabel } from 'in-sdk/snapshot/legacy';
import { getSnapshotDefinition } from 'in-sdk/snapshot/registry';
export { getIconSvgPath } from 'in-sdk/iconRegistry';

export function getChartWiggleRoom(plugin) {
  const chartWiggleRoom = getSnapshotDefinition(plugin).chartWiggleRoom;
  if (chartWiggleRoom == null) {
    return 5000;
  }
  return chartWiggleRoom;
}

export function isNewDashboard(plugin) {
  const isNewDashboard = getSnapshotDefinition(plugin).isNewDashboard;
  if (isNewDashboard == null) {
    return false;
  }
  return isNewDashboard;
}

export function getPower(snapshot) {
  const get = getSnapshotDefinition(snapshot.get('plugin')).getPower;
  if (get) {
    return get(snapshot);
  }
  return -1;
}

export function getShowZoneInSidebarHeader(plugin) {
  return getSnapshotDefinition(plugin).showZoneInSidebarHeader === true;
}

export function supportsCodeView(snapshot, file) {
  const snapshotDefinition = getSnapshotDefinition(snapshot.get('plugin'));
  const supports = snapshotDefinition.supportsCodeView;
  if (!snapshotDefinition.getCodeView) {
    return false;
  } else if (supports == null) {
    return true;
  } else if (supports === true) {
    return true;
  } else if (supports === false) {
    return false;
  }

  return supports(snapshot, file);
}

export function getCodeView(snapshot, file, line) {
  return getSnapshotDefinition(snapshot.get('plugin')).getCodeView(snapshot, file, line);
}

export function supportTableView(plugin) {
  return getSnapshotDefinition(plugin).tableDefinition != null;
}

/**
 * An array of cell definitions. Where each cell definition must look like this:
 *
 * title: <title of column>
 * maxWidth?: <maximum width of column, preferably in rem, e.g. 5rem>
 * type: <String|Number: This type defines how rows are sorted.
 * get(snapshot) => ContentDefinition
 *
 * The ContentDefinition has quite a few shortcuts meant to make forge development
 * easy (and consequently UI development a tad harder). The return value defines
 * what value should be presented to the user in that column. On top of that, it
 * always defines a sortable value (short: sortable) which is used when sorting
 * the table. The following return values are possible:
 *
 * - {
 *     content: <React element | string>,
 *     content$: <when content is not defined, must resolve to react element|string>
 *     sortable: <string|number>
 *     sortable$: <when sortable is not defined, must resolve to string|number>
 *   }
 * - null, which will result in:
 *   {
 *     content: ''
 *     sortable: <0 when type = number, '' when type = string>
 *   }
 * - string, which will result in:
 *   {
 *     content: <the string>
 *     sortable: <the string>
 *   }
 * - number, which will result in:
 *   {
 *     content: <the number>
 *     sortable: <the number>
 *   }
 * - Observable, which has to resolve to:
 *   {
 *     content: <React element | string>,
 *     sortable: <string|number>
 *   }
 */
export function getTableDefinition(plugin) {
  return getSnapshotDefinition(plugin).tableDefinition;
}
