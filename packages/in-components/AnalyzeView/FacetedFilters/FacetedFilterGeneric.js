/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useMemo, useState } from 'react';

import { Stack, SearchInput } from '@instana/components';

import FacetedExpandableCard from 'in-components/AnalyzeView/FacetedFilters/FacetedExpandableCard';
import SuggestionsPresenter from 'in-components/AnalyzeView/FacetedFilters/SuggestionsPresenter';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import ExistingValue from 'in-components/AnalyzeView/FacetedFilters/ExistingValue';
import { removeFacetItem } from 'in-components/AnalyzeView/FacetedFilters/facets';
import { useSuggestions } from 'in-components/AnalyzeView/useSuggestions';
import { identity } from 'in-services/util/function';
import { isLoading } from 'in-services/entityUtils';
import { hasError } from 'in-services/util/result';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from './FacetedFilterGeneric.mless';

const DEFAULT_SUGGESTIONS_SIZE = 5;

export default function FacetedFilterGeneric(props) {
  const {
    tag,
    title,
    entity,
    facets,
    formModelWithFacets,
    openByDefault,
    enableUseAsGroup = true,
    getHrefToGroupedView,
    getHrefToUngroupedView,
    groupbyTag,
    dataSource,
    getUpdatedFacetedSearchHref,
    customLabelMapper,
    tracker
  } = props;

  const [valueFilter, setValueFilter] = useState('');
  const [isDisabledWithNoValues, setIsDisabledWithNoValues] = useState(false);
  const selectedValues = useMemo(() => facets[tag] ?? [], [facets, tag]);

  useEffect(() => {
    // Every time there's a change in formmodel and/or facets
    // enable facet again to check for possible suggestions
    setIsDisabledWithNoValues(false);
  }, [formModelWithFacets]);

  const getSubtitle = () => {
    if (isDisabledWithNoValues) {
      return t('in-components:analyze.noResults');
    } else if (selectedValues.length > 0) {
      return t('in-components:analyze.activeFacets', { count: selectedValues.length });
    }
  };
  const { trackUa2FacetedSearchGroupChanged, trackUa2FacetedSearchFilterAdded, trackUa2FacetedSearchGroupRemoved } =
    useApplicationTracker();
  const uaFacetedTracker = {
    groupClicked: trackUa2FacetedSearchGroupChanged,
    suggestionClicked: trackUa2FacetedSearchFilterAdded,
    groupRemoved: trackUa2FacetedSearchGroupRemoved
  };
  const trackerMethods = {
    ...uaFacetedTracker,
    ...(tracker ?? {})
  };

  return (
    <FacetedExpandableCard
      title={title}
      subtitle={getSubtitle()}
      openByDefault={openByDefault}
      disabled={isDisabledWithNoValues}
      tag={tag}
      entity={entity}
      dataSource={dataSource}
      isActiveGroup={tag === groupbyTag}
      enableUseAsGroup={enableUseAsGroup}
      tracker={trackerMethods}
      getHrefToGroupedView={getHrefToGroupedView}
      getHrefToUngroupedView={getHrefToUngroupedView}
    >
      {selectedValues.length > 0 ? (
        <ExistingFilters
          title={title}
          selectedValues={selectedValues}
          facets={facets}
          tag={tag}
          entity={entity}
          getUpdatedFacetedSearchHref={getUpdatedFacetedSearchHref}
          customLabelMapper={customLabelMapper}
          disabled={isDisabledWithNoValues}
        />
      ) : (
        <SearchAndSuggestions
          {...props}
          valueFilter={valueFilter}
          setValueFilter={setValueFilter}
          selectedValues={selectedValues}
          setIsDisabledWithNoValues={setIsDisabledWithNoValues}
          tracker={uaFacetedTracker}
        />
      )}
    </FacetedExpandableCard>
  );
}

function ExistingFilters({ selectedValues, facets, tag, getUpdatedFacetedSearchHref, customLabelMapper = identity }) {
  return (
    <Stack gap="small">
      {selectedValues.map((value, i) => (
        <ExistingValue
          key={i}
          value={customLabelMapper(value)}
          removeLink={getUpdatedFacetedSearchHref(removeFacetItem(facets, tag, value))}
        />
      ))}
    </Stack>
  );
}

function SearchAndSuggestions(props) {
  const {
    tag,
    facets,
    getUpdatedFacetedSearchHref,
    valueFilter,
    setValueFilter,
    dataSource,
    selectedValues,
    setIsDisabledWithNoValues,
    customLabelMapper = identity,
    tracker
  } = props;

  const tagSuggestions$ = useSuggestions({
    ...props,
    valueFilter
  });

  useEffect(() => {
    setIsDisabledWithNoValues(
      valueFilter === '' &&
        !isLoading(tagSuggestions$) &&
        selectedValues.length === 0 &&
        tagSuggestions$?.data?.items?.length === 0 &&
        !hasError(tagSuggestions$)
    );
  }, [setIsDisabledWithNoValues, selectedValues, valueFilter, tagSuggestions$]);

  const loading = tagSuggestions$?.progress?.loading;
  const suggestions = tagSuggestions$?.data?.items;
  const errors = tagSuggestions$?.errors;

  return (
    <Stack gap="small">
      {(!isBlank(valueFilter) || suggestions?.length > DEFAULT_SUGGESTIONS_SIZE) && (
        <SearchInput
          onChange={setValueFilter}
          query={valueFilter}
          className={locals.searchContainer}
          inputClassName={locals.search}
          withoutIcon
          placeholder={t('in-components:searchInput.placeholderSearch')}
        />
      )}
      <SuggestionsPresenter
        loading={loading}
        errors={errors}
        suggestions={suggestions}
        orderSuggestions={props.orderSuggestions}
        getMetric={props.getMetric}
        facets={facets}
        getUpdatedFacetedSearchHref={getUpdatedFacetedSearchHref}
        tag={tag}
        customLabelMapper={customLabelMapper}
        dataSource={dataSource}
        tracker={tracker}
        fallbackValues={props.fallbackValues}
      />
    </Stack>
  );
}
