/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';
import React, { useState } from 'react';
import { escapeRegExp } from 'lodash';

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

export default function FacetedFilterGeneric(props) {
  const { title, tag, openByDefault, enableUseAsGroup = true, groupbyTag, dataSource } = props;

  return (
    <FacetedExpandableCard title={title} openByDefault={openByDefault} tag={tag} dataSource={dataSource}>
      <Body {...props} enableUseAsGroup={enableUseAsGroup && tag !== groupbyTag} />
    </FacetedExpandableCard>
  );
}

function Body(props) {
  const { formModel, tag, entity, title, getUpdatedTagExpressionHref, customLabelMapper } = props;

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
  return <SearchAndSuggestions {...props} valueFilter={valueFilter} setValueFilter={setValueFilter} />;
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
  tagCatalog,
  tracker
}) {
  const timeConfig = useTimeConfig();
  const tagDefinition = tagCatalog?.tags.find(tagEntry => tagEntry.name === tag);
  const isBooleanTag = tagDefinition?.type === 'BOOLEAN';

  const valueRegex = new RegExp(
    escapeRegExp(valueFilter)
      .split('')
      .join('.*'),
    'i'
  );
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
        tracker={tracker}
      />
    </Stack>
  );
}
