import { withProps } from 'recompose';

import { createFilter } from 'in-analyze/filterBuilder';

export const tagFilterManipulators = withProps(({ filters, setTagFilters /*, timeConfig, filterableTags*/ }) => {
  const tagFilters = filters.get('tagFilter').toJS();
  return {
    removeTagFilter(name) {
      setTagFilters(tagFilters.filter(f => f.name !== name));
    },
    addTagFilter(newTagFilter) {
      setTagFilters(tagFilters.concat(newTagFilter));
    },
    upsertTagFilter(newTagFilter) {
      const newFilter = createFilter(newTagFilter);
      setTagFilters(tagFilters.filter(f => f.name !== newFilter.name).concat(newFilter));
    },
    clearTagFilters() {
      setTagFilters([]);
    }
  };
});
