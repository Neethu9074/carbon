import { compose, withProps } from 'recompose';
import React from 'react';

import {
  getTagFilterListForBackendSubscription,
  convertToApplicationAreaSpecificTagFilter
} from 'in-analyze/applicationFilter';
import TagFilterConfiguration from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/TagFilterConfiguration';
import EditTagFilterDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditTagFilterDialog';
import QuickFilterBar from 'in-analyze/AnalyzeView/components/QuickFilterBar';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { tagFilterManipulators } from 'in-analyze/tagFiltersHoc';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default compose(
  connectTo({
    timeConfig: timeConfig$
  }),
  withProps(({ form, onChange, timeConfig }) => {
    const applicationAreaSpecificTagFilters = convertToApplicationAreaSpecificTagFilter(form.get('tagFilters').value);
    return {
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
      setTagFilters: tagFilters =>
        onChange(['tagFilters'], field =>
          field.setValue(getTagFilterListForBackendSubscription(tagFilters)).setTouched(true)
        )
    };
  }),
  tagFilterManipulators
)(QuickFilterForm);

function QuickFilterForm(props) {
  const { tagFilters, removeTagFilter } = props;
  return (
    <TagFilterConfiguration
      quickFilterBar={<QuickFilterBar {...props} showLatencySelector={false} showHiddenCallsSelector={false} />}
      tagFilterList={
        // For some reason the AP tag filter list needs a custom tag filters list. No idea why it just
        // doesn't use the same mechanism as the bar :(.
        <TagFilterList
          {...props}
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
