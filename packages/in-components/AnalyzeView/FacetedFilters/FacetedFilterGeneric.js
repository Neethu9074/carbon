/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useMemo, useState } from 'react';

import { Stack } from '@instana/components';

import FacetedExpandableCard from 'in-components/AnalyzeView/FacetedFilters/FacetedExpandableCard';
import SuggestionsPresenter from 'in-components/AnalyzeView/FacetedFilters/SuggestionsPresenter';
import ExistingValue from 'in-components/AnalyzeView/FacetedFilters/ExistingValue';
import { removeFacetItem } from 'in-components/AnalyzeView/FacetedFilters/facets';
import { useSuggestions } from 'in-components/AnalyzeView/useSuggestions';
import SearchInput from 'in-components/SearchInput/SearchInput';
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
    openByDefault,
    enableUseAsGroup = true,
    groupbyTag,
    dataSource,
    getUpdatedFacetedSearchHref,
    customLabelMapper,
    stickyHeader
  } = props;

  const [valueFilter, setValueFilter] = useState('');
  const [isDisabledWithNoValues, setIsDisabledWithNoValues] = useState(false);
  const selectedValues = useMemo(() => facets[tag] ?? [], [facets, tag]);

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
  }, [tagSuggestions$, selectedValues, valueFilter]);

  const getSubtitle = () => {
    if (isDisabledWithNoValues) {
      return t('in-components:analyze.noResults');
    } else if (selectedValues.length > 0) {
      return t('in-components:analyze.activeFacets', { count: selectedValues.length });
    }
  };

  return (
    <FacetedExpandableCard
      title={title}
      subtitle={getSubtitle()}
      openByDefault={openByDefault}
      disabled={isDisabledWithNoValues}
      tag={tag}
      dataSource={dataSource}
      stickyHeader={stickyHeader}
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
          isLoading={tagSuggestions$?.progress?.loading}
          suggestions={tagSuggestions$?.data?.items}
          errors={tagSuggestions$?.errors}
          valueFilter={valueFilter}
          setValueFilter={setValueFilter}
          enableUseAsGroup={enableUseAsGroup && tag !== groupbyTag}
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
    entity,
    isLoading,
    suggestions,
    errors,
    facets,
    getUpdatedFacetedSearchHref,
    getHrefToGroupedView,
    valueFilter,
    setValueFilter,
    dataSource,
    customLabelMapper = identity,
    enableUseAsGroup,
    tracker
  } = props;

  return (
    <Stack gap="small">
      {(!isBlank(valueFilter) || suggestions?.length > DEFAULT_SUGGESTIONS_SIZE) && (
        <SearchInput
          onChange={setValueFilter}
          query={valueFilter}
          className={locals.searchContainer}
          inputClassName={locals.search}
          withoutIcon
        />
      )}
      <SuggestionsPresenter
        loading={isLoading}
        errors={errors}
        suggestions={suggestions}
        orderSuggestions={props.orderSuggestions}
        getMetric={props.getMetric}
        facets={facets}
        getUpdatedFacetedSearchHref={getUpdatedFacetedSearchHref}
        getHrefToGroupedView={getHrefToGroupedView}
        tag={tag}
        entity={entity}
        customLabelMapper={customLabelMapper}
        dataSource={dataSource}
        enableUseAsGroup={enableUseAsGroup}
        tracker={tracker}
      />
    </Stack>
  );
}
