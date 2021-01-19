/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getTagFilterListForBackendSubscription, entityTypes } from 'in-analyze/applicationFilter';
import EditTagFilterDialog from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialog';
import { findSubTreeByFullyQualifiedName, isIdTag } from 'in-applications/tags';
import getTagSuggestions from 'in-subscription/application/getTagSuggestions';
import { mapDataHO, noResultObservable } from 'in-services/util/result';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { TAG_TYPES } from 'in-analyze/applicationFilter';

const mapResultData = mapDataHO(data => data.suggestions);

export default function AnalyzeEditTagFilterDialog(props) {
  const { filters, addTagFilter, setTagFilters, trackFilterChanged, trackFilterRemoved, excludedTagFilters } = props;
  const dataSourceConfig = getConfigByDataSource(filters.dataSource);
  const tagFilters = filters.tagFilter;
  const timeConfig = filters.timeConfig;
  const filterTagKeys = excludedTagFilters
    ? dataSourceConfig.filterTagKeys.filter(tag => !excludedTagFilters.includes(tag))
    : dataSourceConfig.filterTagKeys;

  const furtherProps = {
    tagFilters,
    timeConfig,
    filterSuggestionsClientSide: true,
    tagSuggestions: filterTagKeys,
    getKeySuggestions: getSecondLevelKeySuggestions,
    getValueSuggestions: getValueSuggestions,
    addTagFilter: addTagFilter,
    setTagFilters: setTagFilters,
    trackFilterChanged,
    trackFilterRemoved
  };

  return <EditTagFilterDialog {...props} {...furtherProps} />;
}

export function getSecondLevelKeySuggestions({ tagFilters, timeConfig, form }) {
  if (isMissingInForm(form, 'tag')) {
    return noResultObservable();
  }

  const key = form.get('tag').value;
  return getTagSuggestions({
    filter: {
      timeConfig
    },
    tagFilters: getTagFilterListForBackendSubscription(tagFilters),
    tagName: key,
    secondLevelKeyTagName: null,
    valueFilter: null
  }).map(mapResultData);
}

export function getValueSuggestions({ tagFilters, timeConfig, form }) {
  if (isMissingInForm(form, 'tag') || isRequiredButMissingInForm(form, 'key')) {
    return noResultObservable();
  }
  const tagName = form.get('tag').value;
  const secondLevelKeyTagName = form.containsKey('key') ? form.get('key').value : null;
  const entity = form.containsKey('entity') ? form.get('entity').value : entityTypes.NOT_APPLICABLE;

  const node = findSubTreeByFullyQualifiedName(tagName);
  if (
    !node ||
    node.type === TAG_TYPES.NUMBER.technicalName || // no value suggestion for number type tag
    node.type === TAG_TYPES.BOOLEAN.technicalName || // no value suggestion for boolean type tag
    isIdTag(node.name) // no value suggestion for id tags
  ) {
    return noResultObservable();
  }

  const newTagSuggestions = getTagSuggestions({
    filter: {
      timeConfig
    },
    tagFilters: getTagFilterListForBackendSubscription(tagFilters),
    tagName,
    secondLevelKeyTagName,
    entity,
    valueFilter: null
  }).map(mapResultData);

  return newTagSuggestions;
}

function isMissingInForm(form, attribute) {
  return !form.containsKey(attribute) || !form.get(attribute).value;
}

function isRequiredButMissingInForm(form, attribute) {
  return form.containsKey(attribute) && !form.get(attribute).value;
}
