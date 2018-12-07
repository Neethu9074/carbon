import { withProps } from 'recompose';

import {
  filterAddedTracker,
  filterChangedTracker,
  filterRemovedTracker,
  filterClearedTracker
} from 'in-analyze/tracker';
import { createFilter } from 'in-analyze/filterBuilder';

export const tagFilterManipulators = withProps(({ filters, setTagFilters }) => {
  const tagFilters = filters.get('tagFilter').toJS();
  return {
    removeTagFilter(name) {
      setTagFilters(tagFilters.filter(f => f.name !== name));
      const before = tagFilters.filter(f => f.name === name);
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
      setTagFilters(tagFilters.filter(f => f.name !== newFilter.name).concat(newFilter));
      const before = tagFilters.filter(f => f.name === newFilter.name);
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
    filterAddedTracker,
    filterChangedTracker,
    filterRemovedTracker
  };
});
