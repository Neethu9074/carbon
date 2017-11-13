import { assign } from 'lodash';

import { clearSelectedSnapshots } from 'in-views/tableView/stores/selectedSnapshots';
import { fullyQualifiedPlugins, plugins } from 'in-forge/constants';
import { mutateUrl, viewPathParams$ } from 'in-stores/navigation';
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
  observable: viewPathParams$
    .map(config => {
      const view = config.params[0];
      const defaultType = view === 'logical' ? 'service' : 'host';
      return config.params[1] || defaultType;
    })
    .distinct()
}).observable;

export function setSelectedType(type) {
  viewPathParams$.once(config => {
    mutateUrl(params => {
      if (config.params.length > 0) {
        params.pathname = `/table/@${config.params[0]},${type}`;
      }
      return params;
    });
  });
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
