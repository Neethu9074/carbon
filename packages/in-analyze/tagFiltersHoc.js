import React from 'react';

import {
  filterAddedTracker,
  filterChangedTracker,
  filterRemovedTracker,
  filterClearedTracker
} from 'in-analyze/tracker';
import EditTagFilterDialog from 'in-analyze/AnalyzeView/components/AnalyzeEditTagFilterDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { createFilter } from 'in-analyze/filterBuilder';

export function getTagFilterManipulators(props) {
  const { filters, setTagFilters } = props;
  const tagFilters = filters.tagFilter;
  return {
    removeTagFilter(name, operator, secondLevelName, value, entity) {
      const before = tagFilters.slice();
      const newTagFilter = tagFilters.filter(
        f =>
          f.name !== name ||
          (operator != null && f.operator !== operator) ||
          (secondLevelName != null && f.secondLevelName !== secondLevelName) ||
          (value != null && f.value !== value) ||
          (entity != null && f.entity !== entity)
      );
      setTagFilters(newTagFilter);

      if (before.length > 0) {
        filterRemovedTracker({ name, filter: before[0], secondLevelName, value, entity });
      } else {
        filterRemovedTracker({ name, secondLevelName, value, entity });
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
      addActiveDialog(<EditTagFilterDialog {...props} tagFilter={null} forAnalyzeCalls />);
    },
    trackFilterAdded: filterAddedTracker,
    trackFilterChanged: filterChangedTracker,
    trackFilterRemoved: filterRemovedTracker
  };
}
