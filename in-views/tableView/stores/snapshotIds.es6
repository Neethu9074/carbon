import {translateSearchableEntityTypeToFullyQualifiedPluginIds} from 'in-sdk/search/defaultOperators';
import {clearSelectedSnapshots} from 'in-views/tableView/stores/selectedSnapshots';
import createSearchObservable from 'in-services/subscription/search';
import {fullyQualifiedPlugins, plugins} from 'in-forge/constants';
import {setKeyword, getValues} from 'in-stores/search/keywords';
import {clearMetrics} from 'in-views/tableView/stores/metrics';
import {setColumn} from 'in-views/tableView/stores/sorting';
import {focusedMoment$} from 'in-stores/timeline';
import {query$} from 'in-stores/search/query';

export const selectedType$ = query$
  .map(query => {
    if (!query) {
      return plugins.host;
    }

    return getSelectedType(query) || 'host';
  })
  .distinct();


export function setSelectedType(type) {
  setKeyword('selfType', type);
}


export const plugin$ = selectedType$
  .map(type => {
    // Ben 2016-11-02
    // A small hack to support aggregations for services.
    // Consider revisiting this when we have more of these aggregations.
    if (type === 'service') {
      return plugins.defaultLogicalService;
    }
    const pluginIds = translateSearchableEntityTypeToFullyQualifiedPluginIds(type);
    if (pluginIds) {
      return translateFullyQualifiedPluginToShortPluginName(pluginIds[0]) || plugins.host;
    }

    return plugins.host;
  })
  .distinct()
  .tap(() => {
    setColumn(null);
    clearMetrics();
    clearSelectedSnapshots();
  });


export const snapshotIds$ = query$
  .flatMap(query => {
    query = query || '';
    if (!getSelectedType(query)) {
      query += ` selfType:host`;
    }

    return focusedMoment$
      .flatMap(focusedMoment => {
        return createSearchObservable({
          query: query,
          time: focusedMoment,
          view: 'TABLE'
        })
        .map(list => list.toArray());
      });
  });


function getSelectedType(query) {
  return getValues(query, 'selfType')[0];
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
