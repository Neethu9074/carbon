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
  const { tagFilters, onChange, removeTagFilter, excludedTagFilters } = props;

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
  const tagFilterProps = getTagFilterManipulators({ ...props, ...tagFilterProps });

  return (
    <TagFilterConfigurationWrapper
      quickFilterBar={
        <QuickFilterBar
          {...props}
          {...furtherProps}
          {...tagFilterProps}
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
          {...tagFilterProps}
          tagFilters={tagFilters.map(tagFilter => ({
            tag: tagFilter,
            onClick: () => addActiveDialog(<EditTagFilterDialog {...props} tagFilter={tagFilter} forAnalyzeCalls />),
            onRemove: () =>
              removeTagFilter(tagFilter.name, null, tagFilter.secondLevelName, tagFilter.value, tagFilter.entity)
          }))}
        />
      }
    />
  );
}
