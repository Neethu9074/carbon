/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';

import FacetedExpandableCard from 'in-components/AnalyzeView/FacetedFilters/FacetedExpandableCard';
import { addFacetItem, removeFacetItem } from 'in-components/AnalyzeView/FacetedFilters/facets';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { MultiSelect } from 'in-components/AnalyzeView/FacetedFilters/MultiSelect';
import { t } from 'in-i18n';

export default function FacetedFilterMultiSelect(props) {
  const {
    title,
    tag,
    entity,
    facets,
    formModelWithFacets,
    updateFacets,
    customLabelMapper,
    openByDefault,
    enableUseAsGroup = true,
    getHrefToGroupedView,
    getHrefToUngroupedView,
    groupbyTag,
    tracker,
    dataSource
  } = props;

  const [valueFilter, setValueFilter] = useState('');
  const [selectedValues, setSelectedValues] = useState(facets[tag] ?? []);
  const [isDisabledWithNoValues, setIsDisabledWithNoValues] = useState(false);

  useEffect(() => {
    setSelectedValues(facets[tag] ?? []);
  }, [facets, tag]);

  useEffect(() => {
    // Every time there's a change in formmodel and/or facets
    // enable facet again to check for possible suggestions
    setIsDisabledWithNoValues(false);
  }, [formModelWithFacets]);

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
  const { trackUa2FacetedSearchGroupChanged, trackUa2FacetedSearchGroupRemoved, trackUa2FacetedSearchFilterAdded } =
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
      <MultiSelect
        {...props}
        title={title}
        tag={tag}
        selectedValues={selectedValues}
        addToSelection={addItemToSelection}
        removeFromSelection={removeItemFromSelection}
        valueFilter={valueFilter}
        setValueFilter={setValueFilter}
        setIsDisabledWithNoValues={setIsDisabledWithNoValues}
        customLabelMapper={customLabelMapper}
        tracker={trackerMethods}
      />
    </FacetedExpandableCard>
  );
}
