import { withProps } from 'recompose';

import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';

export default withProps(({ tagFilters, setTagFilters, trackFilterRemoved }) => ({
  onRemoveTagFilter: tagFilter => {
    setTagFilters(tagFilters.filter(f => f !== tagFilter));

    if (trackFilterRemoved) {
      const before = tagFilters.filter(f => f === tagFilter);
      if (before.length > 0) {
        trackFilterRemoved({ name: tagFilter.name, filter: before[0] });
      } else {
        trackFilterRemoved({ name: tagFilter.name });
      }
    }
  }
}))(TagFilterListPresenter);
