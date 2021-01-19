/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';

import FacetedExpandableCard from 'in-applications/analyze/components/FacetedSearch/FacetedExpandableCard';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import ExistingValue, { existingValuesForTag } from './ExistingValue';
import SearchInput from 'in-new-components/SearchInput/SearchInput';
import SuggestionsPresenter from './SuggestionsPresenter';
import { pendingResult } from 'in-services/fixedObjects';
import { mapDataHO } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';

import locals from './Suggestion.mless';

export default function FacetedFilterGeneric({
  title,
  tagFilterExpression,
  tag,
  entity,
  hiddenCalls,
  updateFilter,
  dataSource
}) {
  return (
    <FacetedExpandableCard title={title}>
      <Body
        tagFilterExpression={tagFilterExpression}
        tag={tag}
        entity={entity}
        hiddenCalls={hiddenCalls}
        updateFilter={updateFilter}
        dataSource={dataSource}
      />
    </FacetedExpandableCard>
  );
}

function Body({ tagFilterExpression, tag, entity, title, hiddenCalls, updateFilter, dataSource }) {
  const [valueFilter, setValueFilter] = useState('');
  const selectedValues = existingValuesForTag(tagFilterExpression, tag, entity);
  if (selectedValues.length > 0) {
    return (
      <ExistingFilters
        title={title}
        selectedValues={selectedValues}
        remove={value =>
          updateFilter({
            remove: [
              {
                type: TAG,
                name: tag,
                operator: EQUALS,
                value,
                ...(entity && { entity })
              }
            ]
          })
        }
      />
    );
  }
  return (
    <SearchAndSuggestions
      tagFilterExpression={tagFilterExpression}
      hiddenCalls={hiddenCalls}
      tag={tag}
      updateFilter={updateFilter}
      valueFilter={valueFilter}
      setValueFilter={setValueFilter}
      dataSource={dataSource}
    />
  );
}

function ExistingFilters({ selectedValues, remove }) {
  return (
    <>
      {selectedValues.map((value, i) => (
        <ExistingValue key={i} value={value} remove={() => remove(value)} />
      ))}
    </>
  );
}

function SearchAndSuggestions({
  tagFilterExpression,
  hiddenCalls,
  tag,
  updateFilter,
  valueFilter,
  setValueFilter,
  dataSource
}) {
  return (
    <>
      <SearchInput onChange={setValueFilter} query={valueFilter} className={locals.search} withoutIcon />
      <Suggestions
        tag={tag}
        valueFilter={valueFilter}
        tagFilterExpression={tagFilterExpression}
        hiddenCalls={hiddenCalls}
        updateFilter={updateFilter}
        dataSource={dataSource}
      />
    </>
  );
}

function Suggestions({ tagFilterExpression, hiddenCalls, tag, updateFilter, valueFilter, dataSource }) {
  const timeConfig = useTimeConfig();

  const suggestionsFromServer = () =>
    getTagSuggestions({
      tagFilterExpression,
      tagName: tag,
      filter: {
        timeConfig: timeConfig
      },
      filterOnTagName: true,
      includeInternal: hiddenCalls.includeInternal,
      includeSynthetic: hiddenCalls.includeSynthetic,
      metrics: dataSourceConstants[dataSource].sumMetric
    });
  const valueRegex = new RegExp(valueFilter.split('').join('.*'), 'i');
  const suggestions =
    useObservable(
      suggestionsFromServer().map(
        mapDataHO(data => ({
          ...data,
          results: data.results.filter(suggestion => valueRegex.test(suggestion.label))
        }))
      ),
      [tagFilterExpression, hiddenCalls, tag, valueFilter, dataSource, timeConfig]
    ) ?? pendingResult;
  return (
    <SuggestionsPresenter
      loading={suggestions?.progress.loading}
      errors={suggestions?.errors}
      suggestions={suggestions?.data?.results}
      updateFilter={updateFilter}
      tag={tag}
      dataSource={dataSource}
    />
  );
}
