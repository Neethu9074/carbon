/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { assign } from 'lodash';

import { clearSelectedSnapshots } from 'in-infrastructure/tableView/stores/selectedSnapshots';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { infraEventUIInteraction } from 'in-infrastructure/tracking/tracking';
import { clearMetrics } from 'in-infrastructure/tableView/stores/metrics';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { fullyQualifiedPlugins, plugins } from 'in-forge/constants';
import { TABLE_TYPE_CHANGED } from 'in-services/tracking/tracking';
import { tablePath } from 'in-stores/navigation/paths/mainPaths';
import { createTrackingStore } from 'in-stores/store';
import { search } from 'in-stores/snapshot/snapshot';

// TODO: Read this mapping from backend
export const entityTypeToFullyQualifiedPlugin = {
  host: fullyQualifiedPlugins.host,
  docker: fullyQualifiedPlugins.docker,
  jvm: fullyQualifiedPlugins.jvmRuntimePlatform,
  nodejs: fullyQualifiedPlugins.nodeJsRuntimePlatform,
  dropwizard: fullyQualifiedPlugins.dropwizardApplicationContainer,
  agent: fullyQualifiedPlugins.instanaAgent,
  process: fullyQualifiedPlugins.process,
  ping: fullyQualifiedPlugins.ping,
  clickHouseDatabase: fullyQualifiedPlugins.clickHouseDatabase,
  containerd: fullyQualifiedPlugins.containerd,
  crio: fullyQualifiedPlugins.crio,
  podman: fullyQualifiedPlugins.podman,
  garden: fullyQualifiedPlugins.garden,
  lxc: fullyQualifiedPlugins.lxc,
  beeInstanaNode: fullyQualifiedPlugins.beeInstanaNode,
  crowdStrikeFalcon: fullyQualifiedPlugins.crowdStrikeFalcon,
  syntheticPoP: fullyQualifiedPlugins.syntheticPoP
};

const pluginsRequiringTableViewInSearch = ['ping'];

export const selectedType$ = createTrackingStore({
  name: 'tableView/stores/selectedType',
  observable: navigationParameters$
    .map(location => {
      const type = getMatrixParameter(location, tablePath, 'plugin') || 'host';
      const view = pluginsRequiringTableViewInSearch.indexOf(type) !== -1 ? 'TABLE' : 'PHYSICAL';
      return {
        type,
        view
      };
    })
    .filter(selectedType => entityTypeToFullyQualifiedPlugin[selectedType.type])
}).observable.distinct((current, next) => current.type !== next.type || current.view !== next.view);

export function setSelectedType(type) {
  mutateUrl(location => setOrDeleteMatrixKey(location, tablePath, 'plugin', type));
  infraEventUIInteraction({ event: TABLE_TYPE_CHANGED, type });
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
    if (!Object.prototype.hasOwnProperty.call(fullyQualifiedPlugins, plugin)) {
      continue;
    }

    if (fullyQualifiedPlugin === fullyQualifiedPlugins[plugin]) {
      return plugin;
    }
  }

  return null;
}
