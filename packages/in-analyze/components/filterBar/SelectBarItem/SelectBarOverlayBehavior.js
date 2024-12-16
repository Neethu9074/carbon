/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { find } from 'lodash';

import { timeout } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import SelectBarOverlay from 'in-analyze/components/filterBar/SelectBarOverlay/SelectBarOverlay';
import { isNotBlank, compareIgnoreCase } from 'in-services/util/string';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import { entityTypes } from 'in-analyze/applicationFilter';
import { identity } from 'in-services/util/function';
import { t } from 'in-i18n';

export default function SelectBarOverlayBehavior(props) {
  const { upsertTagFilter, removeTagFilter, pluralLabel, tag, close, itemLabelRenderer = identity } = props;
  const tagFilters = props.tagFilters.filter(f => f.name !== props.tag || f.operator !== 'EQUALS');
  const [query, setQuery] = useState('');
  const queryNotBlank = isNotBlank(query);
  const filterSuggestionsClientSide = props.filterSuggestionsClientSide === true;

  if (!filterSuggestionsClientSide && queryNotBlank) {
    tagFilters.push({
      name: props.tag,
      stringValue: query,
      operator: 'CONTAINS'
    });
  }

  const getSuggestionsConfig = {
    timeConfig: props.timeConfig,
    tag: props.tag,
    tagFilters
  };

  const result =
    useObservable(() => {
      if (queryNotBlank && !filterSuggestionsClientSide) {
        return timeout(800).flatMap(() => props.getSuggestions(getSuggestionsConfig));
      }
      return props.getSuggestions(getSuggestionsConfig);
    }, [props.getSuggestions, queryNotBlank, filterSuggestionsClientSide, query]) ?? pendingResult;

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
      moreDataMessage={t('in-analyze:filterBar.selectBarItem.moreDataMessage', { pluralLabel })}
      itemLabelRenderer={itemLabelRenderer}
    />
  );
}
