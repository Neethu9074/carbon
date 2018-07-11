import { assign } from 'lodash';

import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { clearSelectedSnapshots } from 'in-views/tableView/stores/selectedSnapshots';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { fullyQualifiedPlugins, plugins } from 'in-forge/constants';
import { clearMetrics } from 'in-views/tableView/stores/metrics';
import { tablePath } from 'in-stores/navigation/paths/mainPaths';
import { createTrackingStore } from 'in-stores/store';
import { search } from 'in-stores/snapshot/snapshot';

// TODO: Read this mapping from backend
const entityTypeToFullyQualifiedPlugin = {
  host: fullyQualifiedPlugins.host,
  docker: fullyQualifiedPlugins.docker,
  jvm: fullyQualifiedPlugins.jvmRuntimePlatform,
  nodejs: fullyQualifiedPlugins.nodeJsRuntimePlatform,
  service: fullyQualifiedPlugins.defaultLogicalService,
  dropwizard: fullyQualifiedPlugins.dropwizardApplicationContainer,
  agent: fullyQualifiedPlugins.instanaAgent,
  process: fullyQualifiedPlugins.process,
  ping: fullyQualifiedPlugins.ping
};

export const selectedType$ = createTrackingStore({
  name: 'tableView/stores/selectedType',
  observable: navigationParameters$
    .map(location => {
      const isPhysicalView = getMatrixParameter(location, tablePath, 'view') === 'physical';
      const defaultType = isPhysicalView ? 'host' : 'service';
      return {
        type: getMatrixParameter(location, tablePath, 'plugin') || defaultType,
        view: isPhysicalView ? 'PHYSICAL' : 'LOGICAL'
      };
    })
    .filter(selectedType => entityTypeToFullyQualifiedPlugin[selectedType.type])
}).observable.distinct((current, next) => current.type !== next.type || current.view !== next.view);

export function setSelectedType(type) {
  mutateUrl(location => setOrDeleteMatrixKey(location, tablePath, 'plugin', type));

  clearMetrics();
  clearSelectedSnapshots();
}

export const plugin$ = selectedType$.map(translateTypeToPlugin).distinct();

function translateTypeToPlugin(selectedType) {
  const pluginId = entityTypeToFullyQualifiedPlugin[selectedType.type];
  if (pluginId) {
    return translateFullyQualifiedPluginToShortPluginName(pluginId) || plugins.host;
  }
  return plugins.host;
}

export const data$ = selectedType$.flatMap(_selectedType => {
  return search({
    view: _selectedType.view,
    restrictResultEntityType: entityTypeToFullyQualifiedPlugin[_selectedType.type]
  }).map(result => {
    return assign({}, { type: _selectedType.type, plugin: translateTypeToPlugin(_selectedType) }, result);
  });
});

export const matchedSnapshotCount$ = data$.filter(data => data.snapshots != null).map(data => data.snapshots.length);

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
