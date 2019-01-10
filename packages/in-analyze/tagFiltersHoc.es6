import { withProps } from 'recompose';
import React from 'react';

import {
  filterAddedTracker,
  filterChangedTracker,
  filterRemovedTracker,
  filterClearedTracker
} from 'in-analyze/tracker';
import EditTagFilterDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditTagFilterDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { createFilter } from 'in-analyze/filterBuilder';

export const tagFilterManipulators = withProps(props => {
  const { filters, setTagFilters } = props;
  const tagFilters = filters.tagFilter;
  return {
    removeTagFilter(name, operator) {
      setTagFilters(tagFilters.filter(f => f.name !== name || (operator != null && f.operator !== operator)));
      const before = tagFilters.filter(f => f.name === name && (operator == null || f.operator === operator));
      if (before.length > 0) {
        filterRemovedTracker({ name, filter: before[0] });
      } else {
        filterRemovedTracker({ name });
      }
    },
    addTagFilter(newTagFilter) {
      const newFilter = createFilter(newTagFilter);
      setTagFilters(tagFilters.concat(newFilter));
      filterAddedTracker({ filter: newFilter });
    },
    upsertTagFilter(newTagFilter) {
      const newFilter = createFilter(newTagFilter);
      setTagFilters(
        tagFilters.filter(f => f.name !== newFilter.name || f.operator !== newTagFilter.operator).concat(newFilter)
      );
      const before = tagFilters.filter(f => f.name === newFilter.name && f.operator === newTagFilter.operator);
      if (before.length > 0) {
        filterChangedTracker({ before: before[0], after: newFilter });
      } else {
        filterAddedTracker({ filter: newFilter });
      }
    },
    clearTagFilters() {
      setTagFilters([]);
      filterClearedTracker();
    },
    onMoreClick() {
      setActiveDialog(<EditTagFilterDialog {...props} tagFilter={null} forAnalyzeCalls />);
    },
    filterAddedTracker,
    filterChangedTracker,
    filterRemovedTracker
  };
});
