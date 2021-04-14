/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import React, { useState } from 'react';
import { escapeRegExp } from 'lodash';

import FacetedExpandableCard from 'in-applications/analyze/components/FacetedSearch/FacetedExpandableCard';
import SuggestionsPresenter from 'in-applications/analyze/components/FacetedSearch/SuggestionsPresenter';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { dataSourceConstants } from 'in-applications/analyze/metrics';
import ExistingValue, { existingValuesForTag } from './ExistingValue';
import SearchInput from 'in-new-components/SearchInput/SearchInput';
import { identity } from 'in-services/util/function';
import { mapDataHO } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { isBlank } from 'in-services/util/string';

import locals from './Suggestion.mless';

export default function FacetedFilterGeneric({
  title,
  tagFilterExpression,
  tag,
  entity,
  hiddenCalls,
  updateFilter,
  updateGroup,
  dataSource,
  customLabelMapper,
  enableUseAsGroup = true,
  groupbyTag,
  tagCatalog
}) {
  return (
    <FacetedExpandableCard title={title} tag={tag} dataSource={dataSource}>
      <Body
        tagFilterExpression={tagFilterExpression}
        tag={tag}
        entity={entity}
        hiddenCalls={hiddenCalls}
        updateFilter={updateFilter}
        updateGroup={updateGroup}
        dataSource={dataSource}
        customLabelMapper={customLabelMapper}
        enableUseAsGroup={enableUseAsGroup && tag !== groupbyTag}
        tagCatalog={tagCatalog}
      />
    </FacetedExpandableCard>
  );
}

function Body({
  tagFilterExpression,
  tag,
  entity,
  title,
  hiddenCalls,
  updateFilter,
  updateGroup,
  dataSource,
  customLabelMapper,
  enableUseAsGroup,
  tagCatalog
}) {
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
        customLabelMapper={customLabelMapper}
      />
    );
  }
  return (
    <SearchAndSuggestions
      tagFilterExpression={tagFilterExpression}
      hiddenCalls={hiddenCalls}
      tag={tag}
      entity={entity}
      updateFilter={updateFilter}
      updateGroup={updateGroup}
      valueFilter={valueFilter}
      setValueFilter={setValueFilter}
      dataSource={dataSource}
      customLabelMapper={customLabelMapper}
      enableUseAsGroup={enableUseAsGroup}
      tagCatalog={tagCatalog}
    />
  );
}

function ExistingFilters({ selectedValues, remove, customLabelMapper = identity }) {
  return (
    <>
      {selectedValues.map((value, i) => (
        <ExistingValue key={i} value={customLabelMapper(value)} remove={() => remove(value)} />
      ))}
    </>
  );
}

function SearchAndSuggestions({
  tagFilterExpression,
  hiddenCalls,
  tag,
  entity,
  updateFilter,
  updateGroup,
  valueFilter,
  setValueFilter,
  dataSource,
  customLabelMapper = identity,
  enableUseAsGroup,
  tagCatalog
}) {
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
  const tagDefinition = tagCatalog?.tags.find(tagEntry => tagEntry.name === tag);
  const isBooleanTag = tagDefinition?.type === 'BOOLEAN';

  const valueRegex = new RegExp(
    escapeRegExp(valueFilter)
      .split('')
      .join('.*'),
    'i'
  );
  const suggestions = useObservable(
    suggestionsFromServer().map(
      mapDataHO(data => ({
        ...data,
        results: data.results
          .filter(suggestion => valueRegex.test(customLabelMapper(suggestion.label)))
          .map(suggestion => ({
            ...suggestion,
            value: isBooleanTag ? suggestion.label === 'true' : suggestion.label
          }))
      }))
    ),
    [tagFilterExpression, hiddenCalls, tag, valueFilter, dataSource, timeConfig]
  );
  return (
    <>
      {(!isBlank(valueFilter) || suggestions?.data?.results.length > 5) && (
        <SearchInput
          onChange={setValueFilter}
          query={valueFilter}
          className={locals.searchContainer}
          inputClassName={locals.search}
          withoutIcon
        />
      )}
      <SuggestionsPresenter
        loading={suggestions?.progress.loading}
        errors={suggestions?.errors}
        suggestions={suggestions?.data?.results}
        updateFilter={updateFilter}
        updateGroup={updateGroup}
        tag={tag}
        entity={entity}
        dataSource={dataSource}
        customLabelMapper={customLabelMapper}
        enableUseAsGroup={enableUseAsGroup}
      />
    </>
  );
}
