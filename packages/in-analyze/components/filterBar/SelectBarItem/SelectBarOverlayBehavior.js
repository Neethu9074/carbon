/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { timeout } from '@instana/observables';
import { compose, withState } from 'recompose';
import { find } from 'lodash';
import React from 'react';

import SelectBarOverlay from 'in-analyze/components/filterBar/SelectBarOverlay/SelectBarOverlay';
import { isNotBlank, compareIgnoreCase } from 'in-services/util/string';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import { entityTypes } from 'in-analyze/applicationFilter';
import { identity } from 'in-services/util/function';
import connect from 'in-hoc/connectTo';

export default compose(
  withState('query', 'setQuery', ''),
  connect((props, prevProps) => {
    const tagFilters = props.tagFilters.filter(f => f.name !== props.tag || f.operator !== 'EQUALS');
    const queryNotBlank = isNotBlank(props.query);
    const filterSuggestionsClientSide = props.filterSuggestionsClientSide === true;

    if (!filterSuggestionsClientSide && queryNotBlank) {
      tagFilters.push({
        name: props.tag,
        stringValue: props.query,
        operator: 'CONTAINS'
      });
    }

    const getSuggestionsConfig = {
      timeConfig: props.timeConfig,
      tag: props.tag,
      tagFilters
    };

    if (props.query !== prevProps.query && queryNotBlank && !filterSuggestionsClientSide) {
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
          .flatMap(() => props.getSuggestions(getSuggestionsConfig))
          .startWith(pendingResult)
      };
    }
    return {
      result: props.getSuggestions(getSuggestionsConfig)
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
  setQuery,
  filterSuggestionsClientSide,
  itemLabelRenderer = identity
}) {
  // query, loading, onQueryChange, selectedItem, items, onSelectItem
  let items = emptyArray;
  if (result.data) {
    items = result.data.map(item => ({
      key: item,
      label: item
    }));
  }

  // resorting in client because we sort by beacon count in backend to provide a meaningful set of values
  items.sort((a, b) => compareIgnoreCase(a.label, b.label));

  const existingTagFilter = find(tagFilters, f => f.name === tag && f.operator === 'EQUALS');
  let selectedItem;
  if (existingTagFilter) {
    selectedItem = find(items, i => i.key === existingTagFilter.stringValue || i.key === existingTagFilter.value);
  }

  return (
    <SelectBarOverlay
      items={items}
      filterSuggestionsClientSide={filterSuggestionsClientSide}
      selectedItem={selectedItem}
      loading={result == null || result.progress.loading}
      query={query}
      onQueryChange={setQuery}
      onSelectItem={newItem => {
        if (newItem == null) {
          removeTagFilter(tag, 'EQUALS');
        } else {
          upsertTagFilter({
            name: tag,
            stringValue: newItem.key,
            operator: 'EQUALS',
            entity:
              tag === 'service.name' || tag === 'application.name' || tag === 'endpoint.name'
                ? entityTypes.DESTINATION
                : entityTypes.NOT_APPLICABLE
          });
        }
        close();
      }}
      moreDataAvailable={result.data && result.data.canLoadMore}
      moreDataMessage={`More ${pluralLabel} available. Only the top 200 ${pluralLabel} shown. Use the filter to drill down further.`}
      itemLabelRenderer={itemLabelRenderer}
    />
  );
}
