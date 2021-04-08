/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';
import React, { useState } from 'react';

import ExistingValue, { getExistingValuesForTag } from 'in-new-components/AnalyzeView/FacetedFilters/ExistingValue';
import FacetedExpandableCard from 'in-new-components/AnalyzeView/FacetedFilters/FacetedExpandableCard';
import SuggestionsPresenter from 'in-new-components/AnalyzeView/FacetedFilters/SuggestionsPresenter';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import SearchInput from 'in-new-components/SearchInput/SearchInput';
import { pendingResult } from 'in-services/fixedObjects';
import { identity } from 'in-services/util/function';
import { mapDataHO } from 'in-services/util/result';
import Stack from 'in-new-components/layout/Stack';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { isBlank } from 'in-services/util/string';

import locals from './FacetedFilterGeneric.mless';

export default function FacetedFilterGeneric({
  title,
  formModel,
  formModelExcludingMissingGroupingTag,
  tag,
  entity,
  getFacetedGroupLabel,
  hiddenCalls,
  getUpdatedTagExpressionHref,
  getHrefToGroupedView,
  openByDefault,
  dataSource,
  getSuggestions,
  customLabelMapper,
  enableUseAsGroup = true,
  groupbyTag,
  tagCatalog
}) {
  return (
    <FacetedExpandableCard title={title} openByDefault={openByDefault}>
      <Body
        formModel={formModel}
        formModelExcludingMissingGroupingTag={formModelExcludingMissingGroupingTag}
        tag={tag}
        entity={entity}
        hiddenCalls={hiddenCalls}
        getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
        getHrefToGroupedView={getHrefToGroupedView}
        getFacetedGroupLabel={getFacetedGroupLabel}
        dataSource={dataSource}
        getSuggestions={getSuggestions}
        customLabelMapper={customLabelMapper}
        enableUseAsGroup={enableUseAsGroup && tag !== groupbyTag}
        tagCatalog={tagCatalog}
      />
    </FacetedExpandableCard>
  );
}

function Body({
  formModel,
  formModelExcludingMissingGroupingTag,
  tag,
  entity,
  title,
  hiddenCalls,
  getFacetedGroupLabel,
  getUpdatedTagExpressionHref,
  getHrefToGroupedView,
  dataSource,
  getSuggestions,
  customLabelMapper,
  enableUseAsGroup,
  tagCatalog
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
        customLabelMapper={customLabelMapper}
      />
    );
  }
  return (
    <SearchAndSuggestions
      formModel={formModel}
      formModelExcludingMissingGroupingTag={formModelExcludingMissingGroupingTag}
      hiddenCalls={hiddenCalls}
      tag={tag}
      getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
      getHrefToGroupedView={getHrefToGroupedView}
      getFacetedGroupLabel={getFacetedGroupLabel}
      valueFilter={valueFilter}
      setValueFilter={setValueFilter}
      dataSource={dataSource}
      getSuggestions={getSuggestions}
      customLabelMapper={customLabelMapper}
      enableUseAsGroup={enableUseAsGroup}
      tagCatalog={tagCatalog}
    />
  );
}

function ExistingFilters({ selectedValues, tag, entity, getUpdatedTagExpressionHref, customLabelMapper = identity }) {
  return (
    <Stack space="small">
      {selectedValues.map((value, i) => (
        <ExistingValue
          key={i}
          value={customLabelMapper(value)}
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
  formModelExcludingMissingGroupingTag,
  hiddenCalls,
  tag,
  getUpdatedTagExpressionHref,
  getHrefToGroupedView,
  getFacetedGroupLabel,
  valueFilter,
  setValueFilter,
  dataSource,
  getSuggestions,
  customLabelMapper = identity,
  enableUseAsGroup,
  tagCatalog
}) {
  const timeConfig = useTimeConfig();
  const tagDefinition = tagCatalog?.tags.find(tagEntry => tagEntry.name === tag);
  const isBooleanTag = tagDefinition?.type === 'BOOLEAN';

  const valueRegex = new RegExp(valueFilter.split('').join('.*'), 'i');
  const suggestions =
    useObservable(
      getSuggestions(tag).map(
        mapDataHO(data => ({
          ...data,
          items: data.items
            .map(suggestion => ({
              ...suggestion,
              name: getFacetedGroupLabel(suggestion)
            }))
            .filter(suggestion => valueRegex.test(customLabelMapper(suggestion.name)))
            .map(suggestion => ({
              ...suggestion,
              value: isBooleanTag ? suggestion.name === 'true' : suggestion.name
            }))
        }))
      ),
      [
        getSuggestions,
        formModel,
        formModelExcludingMissingGroupingTag,
        hiddenCalls,
        tag,
        valueFilter,
        dataSource,
        timeConfig
      ]
    ) ?? pendingResult;
  return (
    <Stack space="small">
      {(!isBlank(valueFilter) || suggestions?.data?.items.length > 5) && (
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
        suggestions={suggestions?.data?.items}
        getUpdatedTagExpressionHref={getUpdatedTagExpressionHref}
        getHrefToGroupedView={getHrefToGroupedView}
        tag={tag}
        customLabelMapper={customLabelMapper}
        dataSource={dataSource}
        enableUseAsGroup={enableUseAsGroup}
      />
    </Stack>
  );
}
