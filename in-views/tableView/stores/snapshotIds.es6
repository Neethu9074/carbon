import { combineLatest } from 'reactive-observables';

import { clearSelectedSnapshots } from 'in-views/tableView/stores/selectedSnapshots';
import createSearchObservable from 'in-services/subscription/search';
import { fullyQualifiedPlugins, plugins } from 'in-forge/constants';
import { setKeyword, getValues } from 'in-stores/search/keywords';
import { clearMetrics } from 'in-views/tableView/stores/metrics';
import { focusedMoment$, timeframe$ } from 'in-stores/timeline';
import { setColumn } from 'in-views/tableView/stores/sorting';
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
    setColumn(null);
    clearMetrics();
    clearSelectedSnapshots();
  });

export const snapshotIds$ = query$.flatMap(query => {
  query = query || '';
  if (!getSelectedType(query)) {
    query += ` entity.selfType:host`;
  }

  return combineLatest([timeframe$, focusedMoment$]).flatMap(([timeframe, focusedMoment]) => {
    return createSearchObservable({
      query: query,
      time: focusedMoment,
      view: 'TABLE',
      timeframe
    }).map(list => list.toArray());
  });
});

export const matchedSnapshotCount$ = snapshotIds$.map(snapshotIds => snapshotIds.length);

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
