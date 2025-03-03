/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';

import { hasError, isLoading } from 'in-services/util/result';

export default function mergeResults(args) {
  const { observables, tags } = collectObservablesAndTags(args);

  return sorterFn =>
    combineLatest(observables).map(results => {
      for (let i = 0; i < results.length; i++) {
        if (isLoading(results[i]) || hasError(results[i])) {
          return results[i];
        }
      }

      let mergedItems = [];
      let totalHits = 0;
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const tag = tags[i];

        mergedItems = mergedItems.concat(getTaggedItems(result, tag));
        totalHits += result.data.totalHits;
      }

      if (sorterFn) {
        mergedItems.sort(sorterFn);
      }

      return {
        progress: { loading: false },
        errors: [],
        // results may be an empty array in cases in which there aren't any platforms or
        // when the user doesn't have access to these due to RBAC.
        time: results?.[0]?.time ?? Date.now(),
        adjustedWindowSize: results?.[0]?.adjustedWindowSize ?? undefined,
        data: {
          items: mergedItems,
          totalHits
        }
      };
    });
}

function collectObservablesAndTags(args) {
  const observables = [];
  const tags = [];
  for (let i = 0; i < args.length; i += 2) {
    const observable = args[i];
    const tag = args[i + 1];
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
