import { clearSelectedSnapshots } from 'in-views/tableView/stores/selectedSnapshots';
import { fullyQualifiedPlugins, plugins } from 'in-forge/constants';
import { getSnapshotsByQuery } from 'in-stores/snapshot/snapshot';
import { setKeyword, getValues } from 'in-stores/search/keywords';
import { clearMetrics } from 'in-views/tableView/stores/metrics';
import { query$ } from 'in-stores/search/query';

// TODO: Read this mapping from backend
const entityTypeToFullyQualifiedPlugin = {
  host: fullyQualifiedPlugins.host,
  docker: fullyQualifiedPlugins.docker,
  jvm: fullyQualifiedPlugins.jvmRuntimePlatform,
  nodejs: fullyQualifiedPlugins.nodeJsRuntimePlatform,
  service: fullyQualifiedPlugins.defaultLogicalService,
  dropwizard: fullyQualifiedPlugins.dropwizardApplicationContainer,
  agent: fullyQualifiedPlugins.instanaAgent,
  process: fullyQualifiedPlugins.process
};

export const selectedType$ = query$
  .map(query => {
    if (!query) {
      return plugins.host;
    }

    return getSelectedType(query) || 'host';
  })
  .distinct();

export function setSelectedType(type) {
  setKeyword('entity.selfType', type);
}

export const plugin$ = selectedType$
  .map(type => {
    const pluginId = entityTypeToFullyQualifiedPlugin[type];
    if (pluginId) {
      return translateFullyQualifiedPluginToShortPluginName(pluginId) || plugins.host;
    }

    return plugins.host;
  })
  .distinct()
  .tap(() => {
    clearMetrics();
    clearSelectedSnapshots();
  });

export const snapshots$ = getSnapshotsByQuery('entity.selfType:website');
export const matchedSnapshotCount$ = snapshots$.map(snapshots => snapshots.length);

function getSelectedType(query) {
  return getValues(query, 'entity.selfType')[0];
}

function translateFullyQualifiedPluginToShortPluginName(fullyQualifiedPlugin) {
  for (const plugin in fullyQualifiedPlugins) {
    if (!fullyQualifiedPlugins.hasOwnProperty(plugin)) {
      continue;
    }

    if (fullyQualifiedPlugin === fullyQualifiedPlugins[plugin]) {
      return plugin;
    }
  }

  return null;
}
