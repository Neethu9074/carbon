import { timeout } from 'reactive-observables';
import { compose, withState } from 'recompose';
import { find } from 'lodash';
import React from 'react';

import SelectBarOverlay from 'in-analyze/components/filterBar/SelectBarOverlay/SelectBarOverlay';
import getWebsiteBeaconGroups from 'in-subscription/websiteMonitoring/getWebsiteBeaconGroups';
import { isNotBlank, compareIgnoreCase } from 'in-services/util/string';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import connect from 'in-hoc/connectTo';

export default compose(
  withState('query', 'setQuery', ''),
  connect((props, prevProps) => {
    const tagFilters = props.tagFilters.filter(f => f.name !== props.tag);
    const queryNotBlank = isNotBlank(props.query);

    if (queryNotBlank) {
      tagFilters.push({
        name: props.tag,
        stringValue: props.query,
        operator: 'CONTAINS'
      });
    }

    const subscriptionConfig = {
      timeConfig: props.timeConfig,
      tagFilters: tagFilters,
      metrics: {
        beaconCount: {
          metric: 'beaconCount',
          aggregation: 'SUM'
        }
      },
      order: {
        by: 'beaconCount',
        direction: 'DESC'
      },
      pagination: {
        retrievalSize: 200
      },
      group: {
        groupbyTag: props.tag
      }
    };

    if (props.query !== prevProps.query && queryNotBlank) {
      // Query changes are frequent and we need to debounce these changes.
      // Also, while debouncing, we immediately want to turn the table state
      // into a loading state. This is better than having the state of an input
      // field and the state of the table differ (happens when debouncing within an input
      // field and the table is still showing data for a previous query).
      //
      // The combination of a connectTo() and a timeout().flatMap is effectively
      // a debounce implementation!
      //
      // Because we are debouncing only on query changes and because we are turning
      // the table immediately into a loading state, we can use larger waiting times
      // before retrieving data and thereby reduce backend pressure!
      return {
        result: timeout(800)
          .flatMap(() => getWebsiteBeaconGroups(subscriptionConfig))
          .startWith(pendingResult)
      };
    }
    return {
      result: getWebsiteBeaconGroups(subscriptionConfig)
    };
  })
)(SelectBarOverlayBehavior);

function SelectBarOverlayBehavior({
  result,
  tagFilters,
  upsertTagFilter,
  removeTagFilter,
  pluralLabel,
  tag,
  close,
  query,
  setQuery
}) {
  // query, loading, onQueryChange, selectedItem, items, onSelectItem
  let items = emptyArray;
  if (result.data) {
    items = result.data.items.map(item => {
      const key = JSON.parse(item.name);
      return {
        key,
        label: key
      };
    });
  }

  // resorting in client because we sort by beacon count in backend to provide a meaningful set of values
  items.sort((a, b) => compareIgnoreCase(a.label, b.label));

  const existingTagFilter = find(tagFilters, f => f.name === tag);
  let selectedItem;
  if (existingTagFilter) {
    selectedItem = find(items, i => i.key === existingTagFilter.stringValue);
  }

  return (
    <SelectBarOverlay
      items={items}
      selectedItem={selectedItem}
      loading={result == null || result.progress.loading}
      query={query}
      onQueryChange={setQuery}
      onSelectItem={newItem => {
        if (newItem == null) {
          removeTagFilter(tag);
        } else {
          upsertTagFilter({
            name: tag,
            stringValue: newItem.key,
            operator: 'EQUALS'
          });
        }
        close();
      }}
      moreDataAvailable={result.data && result.data.canLoadMore}
      moreDataMessage={`More ${pluralLabel} available. Only the top 200 ${pluralLabel} shown. Use the filter to drill down further.`}
    />
  );
}
