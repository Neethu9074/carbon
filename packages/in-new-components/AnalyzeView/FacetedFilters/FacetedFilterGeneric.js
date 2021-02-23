/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import React, { useState } from 'react';

import ExistingValue, { getExistingValuesForTag } from 'in-new-components/AnalyzeView/FacetedFilters/ExistingValue';
import FacetedExpandableCard from 'in-new-components/AnalyzeView/FacetedFilters/FacetedExpandableCard';
import SuggestionsPresenter from 'in-new-components/AnalyzeView/FacetedFilters/SuggestionsPresenter';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import SearchInput from 'in-new-components/SearchInput/SearchInput';
import { pendingResult } from 'in-services/fixedObjects';
import { mapDataHO } from 'in-services/util/result';
import Stack from 'in-new-components/layout/Stack';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import { isBlank } from 'in-services/util/string';

import locals from './FacetedFilterGeneric.mless';

export default function FacetedFilterGeneric({
  title,
  formModel,
  tag,
  entity,
  hiddenCalls,
  getUpdatedTagExpressionHref,
  getHrefToGroupedView,
  openByDefault,
  dataSource,
  getSuggestions
}) {
  return (
    <FacetedExpandableCard title={title} openByDefault={openByDefault}>
      <Body
        formModel={formModel}
        tag={tag}
        entity={entity}
        hiddenCalls={hiddenCalls}
        getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
        getHrefToGroupedView={getHrefToGroupedView}
        dataSource={dataSource}
        getSuggestions={getSuggestions}
      />
    </FacetedExpandableCard>
  );
}

function Body({
  formModel,
  tag,
  entity,
  title,
  hiddenCalls,
  getUpdatedTagExpressionHref,
  getHrefToGroupedView,
  dataSource,
  getSuggestions
}) {
  const [valueFilter, setValueFilter] = useState('');
  const selectedValues = getExistingValuesForTag(formModel, tag, entity);
  if (selectedValues.length > 0) {
    return (
      <ExistingFilters
        title={title}
        selectedValues={selectedValues}
        tag={tag}
        entity={entity}
        getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
      />
    );
  }
  return (
    <SearchAndSuggestions
      formModel={formModel}
      hiddenCalls={hiddenCalls}
      tag={tag}
      getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
      getHrefToGroupedView={getHrefToGroupedView}
      valueFilter={valueFilter}
      setValueFilter={setValueFilter}
      dataSource={dataSource}
      getSuggestions={getSuggestions}
    />
  );
}

function ExistingFilters({ selectedValues, tag, entity, getUpdatedTagExpressionHref }) {
  return (
    <Stack space="small">
      {selectedValues.map((value, i) => (
        <ExistingValue
          key={i}
          value={value}
          removeLink={getUpdatedTagExpressionHref({
            remove: [
              {
                type: TAG,
                name: tag,
                operator: EQUALS,
                value,
                ...(entity && { entity })
              }
            ]
          })}
        />
      ))}
    </Stack>
  );
}

function SearchAndSuggestions({
  formModel,
  hiddenCalls,
  tag,
  getUpdatedTagExpressionHref,
  getHrefToGroupedView,
  valueFilter,
  setValueFilter,
  dataSource,
  getSuggestions
}) {
  const timeConfig = useTimeConfig();
  const valueRegex = new RegExp(valueFilter.split('').join('.*'), 'i');
  const suggestions =
    useObservable(
      getSuggestions(tag).map(
        mapDataHO(data => ({
          ...data,
          items: data.items.filter(suggestion => valueRegex.test(suggestion.name))
        }))
      ),
      [formModel, hiddenCalls, tag, valueFilter, dataSource, timeConfig]
    ) ?? pendingResult;
  return (
    <Stack space="small">
      {(!isBlank(valueFilter) || suggestions?.data?.items.length > 5 || suggestions?.progress.loading) && (
        <SearchInput onChange={setValueFilter} query={valueFilter} inputClassName={locals.search} withoutIcon />
      )}
      <SuggestionsPresenter
        loading={suggestions?.progress.loading}
        errors={suggestions?.errors}
        suggestions={suggestions?.data?.items.map(item => ({
          ...item,
          name: JSON.parse(item.name)
        }))}
        getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
        getHrefToGroupedView={getHrefToGroupedView}
        tag={tag}
      />
    </Stack>
  );
}
