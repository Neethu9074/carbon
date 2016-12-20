import {translateSearchableEntityTypeToFullyQualifiedPluginIds} from 'in-sdk/search/defaultOperators';
import {clearSelectedSnapshots} from 'in-views/tableView/stores/selectedSnapshots';
import createSearchObservable from 'in-services/subscription/search';
import {fullyQualifiedPlugins, plugins} from 'in-forge/constants';
import {clearMetrics} from 'in-views/tableView/stores/metrics';
import {setColumn} from 'in-views/tableView/stores/sorting';
import {parsedQuery$} from 'in-stores/search/search';
import {focusedMoment$} from 'in-stores/timeline';

export const plugin$ = parsedQuery$
  .map(parsedQuery => {
    if (!parsedQuery) {
      return plugins.host;
    }

    if (parsedQuery) {
      const type = getSelectedType(parsedQuery);
      if (type) {
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
      }
    }

    return plugins.host;
  })
  .distinct()
  .tap(() => {
    setColumn(null);
    clearMetrics();
    clearSelectedSnapshots();
  });


export const snapshotIds$ = parsedQuery$
  .flatMap(parsedQuery => {
    let luceneQuery = parsedQuery ? parsedQuery.luceneQuery : '';
    if (!parsedQuery || !getSelectedType(parsedQuery)) {
      luceneQuery += ` type:host`;
    }

    return focusedMoment$
      .flatMap(focusedMoment => {
        return createSearchObservable({
          query: luceneQuery,
          time: focusedMoment,
          view: 'TABLE'
        })
        .map(list => list.toArray());
      });
  });


function getSelectedType(parsedQuery) {
  const parts = parsedQuery.queryParts;

  for (let i = 0, len = parts.length; i < len; i++) {
    const part = parts[i];
    if (part.key === 'type') {
      return part.value;
    }
  }

  return null;
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
