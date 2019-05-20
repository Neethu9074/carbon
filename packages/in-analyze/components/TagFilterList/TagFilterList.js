import { withProps } from 'recompose';

import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';

export default withProps(({ tagFilters, setTagFilters, filterRemovedTracker }) => ({
  onRemoveTagFilter: tagFilter => {
    setTagFilters(tagFilters.filter(f => f !== tagFilter));

    if (filterRemovedTracker) {
      const before = tagFilters.filter(f => f === tagFilter);
      if (before.length > 0) {
        filterRemovedTracker({ name: tagFilter.name, filter: before[0] });
      } else {
        filterRemovedTracker({ name: tagFilter.name });
      }
    }
  }
}))(TagFilterListPresenter);
