import { withProps } from 'recompose';

export const tagFilterManipulators = withProps(({ tagFilters, setTagFilters }) => ({
  removeTagFilter(name) {
    setTagFilters(tagFilters.filter(f => f.name !== name));
  },
  addTagFilter(newTagFilter) {
    setTagFilters(tagFilters.concat(newTagFilter));
  },
  upsertTagFilter(newTagFilter) {
    setTagFilters(tagFilters.filter(f => f.name !== newTagFilter.name).concat(newTagFilter));
  },
  clearTagFilters() {
    setTagFilters([]);
  }
}));
