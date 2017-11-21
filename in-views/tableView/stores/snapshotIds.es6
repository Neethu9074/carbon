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
      const isPhysicalView = params.matrix.view === 'physical';
      const defaultType = isPhysicalView ? 'host' : 'service';
      return {
        type: params.matrix.plugin || defaultType,
        view: isPhysicalView ? 'PHYSICAL' : 'LOGICAL'
      };
    })
    .filter(selectedType => entityTypeToFullyQualifiedPlugin[selectedType.type])
    .distinct()
}).observable;

export function setSelectedType(type) {
  setOrDeleteMatrixKey('plugin', type);

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
  return search({ queryExtension: `entity.selfType:${_selectedType.type}`, view: _selectedType.view }).map(result => {
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
