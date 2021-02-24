/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import { timeout } from '@instana/observables';
import { compose, withState } from 'recompose';
import React from 'react';

import MultiSelectBarOverlay from 'in-analyze/components/filterBar/MultiSelectBarOverlay/MultiSelectBarOverlay';
import { isNotBlank, compareIgnoreCase } from 'in-services/util/string';
import { entityTypes, operators } from 'in-analyze/applicationFilter';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
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
        operator: operators.CONTAINS
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
)(MultiSelectBarOverlayBehavior);

function MultiSelectBarOverlayBehavior({
  result,
  tagFilters,
  addTagFilter,
  removeTagFilter,
  pluralLabel,
  tag,
  query,
  setQuery,
  filterSuggestionsClientSide,
  itemLabelRenderer = identity
}) {
  let items = emptyArray;
  if (result.data) {
    items = result.data.map(item => ({
      key: item,
      label: item
    }));
  }

  items.sort((a, b) => compareIgnoreCase(a.label, b.label));

  const existingTagFilters = tagFilters.filter(filter => filter.name === tag && filter.operator === operators.EQUALS);

  let selectedItems;

  if (existingTagFilters) {
    selectedItems = existingTagFilters
      .filter(existingFilter => items.some(item => existingFilter.value || existingFilter.stringValue === item.key))
      .map(item => ({ key: item.value || item.stringValue, label: item.value || item.stringValue }));
  }

  return (
    <MultiSelectBarOverlay
      items={items}
      filterSuggestionsClientSide={filterSuggestionsClientSide}
      selectedItems={selectedItems}
      loading={result == null || result.progress.loading}
      query={query}
      onQueryChange={setQuery}
      onRemoveItem={item => removeTagFilter(tag, operators.EQUALS, null, item.label)}
      onSelectItem={newItem => {
        addTagFilter({
          name: tag,
          stringValue: newItem.key,
          operator: operators.EQUALS,
          entity:
            tag === 'technology' || tag === 'service.name' || tag === 'endpoint.name'
              ? entityTypes.DESTINATION
              : entityTypes.NOT_APPLICABLE
        });
      }}
      moreDataAvailable={result.data && result.data.canLoadMore}
      moreDataMessage={t('in-analyze:filterBar.multiSelectBarItem.moreDataMessage', { pluralLabel })}
      itemLabelRenderer={itemLabelRenderer}
    />
  );
}
