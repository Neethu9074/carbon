import { withProps } from 'recompose';
import React from 'react';

import EditTagFilterDialog from 'in-analyze/components/EditTagFilterDialog/EditTagFilterDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { tagKeys } from 'in-websites/tags';

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
  },
  onMoreClick() {
    setActiveDialog(
      <EditTagFilterDialog tagFilters={tagFilters} setTagFilters={setTagFilters} tagSuggestions={tagKeys} />
    );
  },
  onTagFilterClick(tagFilter) {
    setActiveDialog(
      <EditTagFilterDialog
        tagFilter={tagFilter}
        tagFilters={tagFilters}
        setTagFilters={setTagFilters}
        tagSuggestions={tagKeys}
      />
    );
  }
}));
