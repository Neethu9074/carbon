import { combineLatest } from 'reactive-observables';

import { hasError, isLoading } from 'in-services/util/result';

export default function mergeResults() {
  const { observables, tags } = collectObservablesAndTags(arguments);

  return sorterFn =>
    combineLatest(observables).map(results => {
      for (let i = 0; i < results.length; i++) {
        if (isLoading(results[i]) || hasError(results[i])) {
          return results[i];
        }
      }

      let mergedItems = [];
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const tag = tags[i];

        mergedItems = mergedItems.concat(getTaggedItems(result, tag));
      }

      if (sorterFn) {
        mergedItems.sort(sorterFn);
      }

      return {
        progress: { loading: false },
        errors: [],
        time: results[0].time,
        adjustedWindowSize: results[0].adjustedWindowSize,
        data: {
          items: mergedItems
        }
      };
    });
}

function collectObservablesAndTags(_arguments) {
  const observables = [];
  const tags = [];
  for (let i = 0; i < _arguments.length; i += 2) {
    const observable = _arguments[i];
    const tag = _arguments[i + 1];
    observables.push(observable);
    tags.push(tag);
  }
  return { observables, tags };
}

function getTaggedItems(result, tag) {
  return result.data.items.map(item => {
    const mappedItem = { ...item };
    mappedItem[tag] = true;
    return mappedItem;
  });
}
