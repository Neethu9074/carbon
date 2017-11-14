import { assign } from 'lodash';

import { clearSelectedSnapshots } from 'in-views/tableView/stores/selectedSnapshots';
import { setOrDeleteMatrixKey, navigationParameters$ } from 'in-stores/navigation';
import { fullyQualifiedPlugins, plugins } from 'in-forge/constants';
import { clearMetrics } from 'in-views/tableView/stores/metrics';
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
  process: fullyQualifiedPlugins.process
};

export const selectedType$ = createTrackingStore({
  name: 'tableView/stores/selectedType',
  observable: navigationParameters$
    .map(params => {
      const defaultType = params.pathname.indexOf('/table/physical') >= 0 ? 'host' : 'service';
      return params.matrix.plugin || defaultType;
    })
    .filter(type => entityTypeToFullyQualifiedPlugin[type])
    .distinct()
}).observable;

export function setSelectedType(type) {
  setOrDeleteMatrixKey('plugin', type);
}

export const plugin$ = selectedType$
  .map(translateTypeToPlugin)
  .distinct()
  .tap(() => {
    clearMetrics();
    clearSelectedSnapshots();
  });

function translateTypeToPlugin(type) {
  const pluginId = entityTypeToFullyQualifiedPlugin[type];
  if (pluginId) {
    return translateFullyQualifiedPluginToShortPluginName(pluginId) || plugins.host;
  }
  return plugins.host;
}

export const data$ = selectedType$.flatMap(_selectedType => {
  return search({ queryExtension: `entity.selfType:${_selectedType}` }).map(result =>
    assign({}, { type: _selectedType, plugin: translateTypeToPlugin(_selectedType) }, result)
  );
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
