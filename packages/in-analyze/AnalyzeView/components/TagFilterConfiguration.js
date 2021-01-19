/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  getTagFilterListForBackendSubscription,
  convertToApplicationAreaSpecificTagFilter
} from 'in-analyze/applicationFilter';
import TagFilterConfigurationWrapper from 'in-analyze/AnalyzeView/components/TagFilterConfigurationWrapper';
import EditTagFilterDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditTagFilterDialog';
import QuickFilterBar from 'in-analyze/AnalyzeView/components/QuickFilterBar';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getTagFilterManipulators } from 'in-analyze/tagFiltersHoc';
import useTimeConfig from 'in-hooks/useTimeConfig';

export default function QuickFilterForm(props) {
  const { tagFilters, onChange, excludedTagFilters } = props;

  const timeConfig = useTimeConfig();

  const applicationAreaSpecificTagFilters = convertToApplicationAreaSpecificTagFilter(tagFilters);
  const furtherProps = {
    tagFilters: applicationAreaSpecificTagFilters,
    filters: {
      // The quick filter bar uses this to determine valid filter options
      dataSource: 'calls',
      // Also needed nested at this location for the value suggestion presentation
      // in the dialogs.
      timeConfig,
      // The AP tag filter manipulators need the tag filters nested like this…
      tagFilters: applicationAreaSpecificTagFilters,
      // Yes, a deliberate copy for a singular tagFilter that is actually the array. The AP analyze area is a mess…
      tagFilter: applicationAreaSpecificTagFilters
    },
    setTagFilters: tagFilters => onChange(getTagFilterListForBackendSubscription(tagFilters))
  };
  const manipulatorProps = getTagFilterManipulators({ ...props, ...furtherProps });

  return (
    <TagFilterConfigurationWrapper
      quickFilterBar={
        <QuickFilterBar
          {...props}
          {...furtherProps}
          {...manipulatorProps}
          timeConfig={timeConfig}
          showLatencySelector={false}
          showHiddenCallsSelector={false}
          excludedTagFilters={excludedTagFilters}
        />
      }
      isEmpty={tagFilters.length === 0}
      tagFilterList={
        // For some reason the AP tag filter list needs a custom tag filters list. No idea why it just
        // doesn't use the same mechanism as the bar :(.
        <TagFilterList
          {...props}
          {...furtherProps}
          {...manipulatorProps}
          tagFilters={furtherProps.tagFilters.map(tagFilter => ({
            tag: tagFilter,
            onClick: () =>
              addActiveDialog(
                <EditTagFilterDialog
                  {...props}
                  {...furtherProps}
                  {...manipulatorProps}
                  tagFilter={tagFilter}
                  forAnalyzeCalls
                />
              ),
            onRemove: () =>
              manipulatorProps.removeTagFilter(
                tagFilter.name,
                null,
                tagFilter.secondLevelName,
                tagFilter.value,
                tagFilter.entity
              )
          }))}
        />
      }
    />
  );
}
