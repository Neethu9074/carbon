/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getSnapshotDefinition, getOptionalSnapshotDefinition } from 'in-sdk/snapshot/registry';
import { emptyMap } from 'in-services/fixedImmutables';

export { registerSnapshotDefinition, getSnapshotDefinition } from 'in-sdk/snapshot/registry';
export { addLabelFinder, getLabel, sortByLabel } from 'in-sdk/snapshot/legacy';

export function getChartWiggleRoom(plugin) {
  const snapshotDefinition = getOptionalSnapshotDefinition(plugin);
  const chartWiggleRoom = snapshotDefinition && snapshotDefinition.chartWiggleRoom;
  if (chartWiggleRoom == null) {
    return 5000;
  }
  return chartWiggleRoom;
}

export function getPower(snapshot) {
  const get = getSnapshotDefinition(snapshot.get('plugin')).getPower;
  if (get) {
    return get(snapshot);
  }
  return 1;
}

export function getShowZoneInSidebarHeader(plugin) {
  return getSnapshotDefinition(plugin).showZoneInSidebarHeader === true;
}

export function getTechnologyLabel(plugin) {
  const definition = getSnapshotDefinition(plugin);
  if (!definition) {
    return '';
  }
  if (definition.technologyDescriptor && definition.technologyDescriptor.label) {
    return definition.technologyDescriptor.label;
  }
  if (definition.pluginName && definition.pluginName.singular) {
    return definition.pluginName.singular;
  }
  return '';
}

export function supportsCodeView(snapshot, file) {
  if (!file) {
    return false;
  }

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

/**
 * To provide context in scenarios where we show a physical entity, we want to show
 * key/value pairs or sets of strings to ease understanding what the entity that we
 * are showing actually is. To do so, plugins can register context "tags".
 *
 * Plugins can define a function to do so:
 * getContext(snapshot) : ImmutableMap<String, ImmutableSet | ImmutableMap>
 *
 * Plugins do not need to add processorTags to the map. It will already exist under the
 * key Tags.
 *
 * This function guarantees that undefined / null is never returned. In the worst case,
 * an empty map is returned.
 */
export function getContext(snapshot) {
  let result = emptyMap;

  const getter = getSnapshotDefinition(snapshot.get('plugin')).getContext;
  if (getter) {
    result = getter(snapshot);
  }

  result = result.set('Tags', snapshot.get('processorTags'));

  return result.filter(v => v && v.size > 0);
}

export function getDashboardHeaderActions(props) {
  const { getDashboardHeaderActions } = getSnapshotDefinition(props.snapshot.get('plugin'));
  return getDashboardHeaderActions ? getDashboardHeaderActions(props) : [];
}

/**
 * For metric dashboards we pre-configure certain metric specs. However for some plugins those
 * metric specs are not correct. E.g. the Prometheus entity has HISTOGRAM metrics but without
 * the `.mean` / `.50th` metrics. So to display correctly the default EXTENDED_HISTOGRAM metric
 * spec has to be replaced by the HISTOGRAM metric spec.
 */
export function getCustomMetricsSpecs(plugin) {
  return getSnapshotDefinition(plugin).customMetricsSpecs;
}
