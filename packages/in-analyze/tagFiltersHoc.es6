import { withProps } from 'recompose';

// import { setActiveDialog } from 'in-components/DialogPresenter/store';
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
    },
    onMoreClick() {
      // setActiveDialog(
      //   <WebsiteEditTagFilterDialog
      //     tagFilters={tagFilters}
      //     setTagFilters={setTagFilters}
      //     tagSuggestions={filterableTags}
      //     timeConfig={timeConfig}
      //   />
      // );
    },
    onTagFilterClick(/*tagFilter*/) {
      // setActiveDialog(
      //   <WebsiteEditTagFilterDialog
      //     tagFilter={tagFilter}
      //     tagFilters={tagFilters}
      //     setTagFilters={setTagFilters}
      //     tagSuggestions={filterableTags}
      //     timeConfig={timeConfig}
      //   />
      // );
    }
  };
});
