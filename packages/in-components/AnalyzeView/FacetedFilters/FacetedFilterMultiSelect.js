/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';

import { ua2FacetedSearchFilterAddedTracker, ua2FacetedSearchGroupChangedTracker } from 'in-applications/tracker';
import FacetedExpandableCard from 'in-components/AnalyzeView/FacetedFilters/FacetedExpandableCard';
import { addFacetItem, removeFacetItem } from 'in-components/AnalyzeView/FacetedFilters/facets';
import { MultiSelect } from 'in-components/AnalyzeView/FacetedFilters/MultiSelect';
import { useSuggestions } from 'in-components/AnalyzeView/useSuggestions';
import { isLoading } from 'in-services/entityUtils';
import { hasError } from 'in-services/util/result';
import { t } from 'in-i18n';

const ua2FacetedTracker = {
  groupClicked: ua2FacetedSearchGroupChangedTracker,
  suggestionClicked: ua2FacetedSearchFilterAddedTracker
};

export default function FacetedFilterMultiSelect(props) {
  const {
    title,
    tag,
    entity,
    facets,
    updateFacets,
    customLabelMapper,
    openByDefault,
    enableUseAsGroup = true,
    getHrefToGroupedView,
    getHrefToUngroupedView,
    groupbyTag,
    dataSource,
    stickyHeader
  } = props;

  const [valueFilter, setValueFilter] = useState('');
  const [selectedValues, setSelectedValues] = useState(facets[tag] ?? []);
  const [isDisabledWithNoValues, setIsDisabledWithNoValues] = useState(false);

  const tagSuggestions$ = useSuggestions({
    ...props,
    valueFilter
  });

  useEffect(() => {
    setSelectedValues(facets[tag] ?? []);
  }, [facets, tag]);

  useEffect(() => {
    setIsDisabledWithNoValues(
      valueFilter === '' &&
        !isLoading(tagSuggestions$) &&
        selectedValues.length === 0 &&
        tagSuggestions$?.data?.items?.length === 0 &&
        !hasError(tagSuggestions$)
    );
  }, [valueFilter, selectedValues, tagSuggestions$]);

  const addItemToSelection = newItem => {
    updateFacets(addFacetItem(facets, tag, newItem));
  };
  const removeItemFromSelection = itemToDelete => {
    updateFacets(removeFacetItem(facets, tag, itemToDelete));
  };

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
      entity={entity}
      dataSource={dataSource}
      isActiveGroup={tag === groupbyTag}
      enableUseAsGroup={enableUseAsGroup}
      groupByTracker={ua2FacetedTracker.groupClicked}
      getHrefToGroupedView={getHrefToGroupedView}
      getHrefToUngroupedView={getHrefToUngroupedView}
      stickyHeader={stickyHeader}
    >
      <MultiSelect
        {...props}
        title={title}
        tag={tag}
        isLoading={tagSuggestions$?.progress?.loading}
        suggestions={tagSuggestions$?.data?.items}
        errors={tagSuggestions$?.errors}
        selectedValues={selectedValues}
        addToSelection={addItemToSelection}
        removeFromSelection={removeItemFromSelection}
        valueFilter={valueFilter}
        setValueFilter={setValueFilter}
        setIsDisabledWithNoValues={setIsDisabledWithNoValues}
        customLabelMapper={customLabelMapper}
        tracker={ua2FacetedTracker}
      />
    </FacetedExpandableCard>
  );
}
