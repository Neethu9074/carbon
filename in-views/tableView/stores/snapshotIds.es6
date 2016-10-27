import {translateSearchableEntityTypeToFullyQualifiedPluginId} from 'in-sdk/search/defaultOperators';
import createSearchObservable from 'in-services/subscription/search';
import {fullyQualifiedPlugins, plugins} from 'in-forge/constants';
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
        return translateFullyQualifiedPluginToShortPluginName(
          translateSearchableEntityTypeToFullyQualifiedPluginId(type)) || plugins.host;
      }
    }

    return plugins.host;
  });


export const snapshotIds$ = parsedQuery$
  .flatMap(parsedQuery => {
    let luceneQuery = parsedQuery ? parsedQuery.luceneQuery : '';
    if (!parsedQuery || !getSelectedType(parsedQuery)) {
      luceneQuery += ` plugin_id:${fullyQualifiedPlugins.host}`;
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
