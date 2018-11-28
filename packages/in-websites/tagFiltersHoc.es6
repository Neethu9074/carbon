import { withProps } from 'recompose';
import React from 'react';

import WebsiteEditTagFilterDialog from 'in-websites/analyze/AnalyzeView/WebsiteEditTagFilterDialog';
import { setActiveDialog } from 'in-components/DialogPresenter/store';

export const tagFilterManipulators = withProps(({ tagFilters, setTagFilters, timeConfig, filterableTags }) => ({
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
      <WebsiteEditTagFilterDialog
        tagFilters={tagFilters}
        setTagFilters={setTagFilters}
        tagSuggestions={filterableTags}
        timeConfig={timeConfig}
      />
    );
  },
  onTagFilterClick(tagFilter) {
    setActiveDialog(
      <WebsiteEditTagFilterDialog
        tagFilter={tagFilter}
        tagFilters={tagFilters}
        setTagFilters={setTagFilters}
        tagSuggestions={filterableTags}
        timeConfig={timeConfig}
      />
    );
  }
}));
