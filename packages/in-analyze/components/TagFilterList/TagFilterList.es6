import { compose, withProps } from 'recompose';

import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';

export default compose(
  withProps(({ tagFilters, setTagFilters }) => ({
    onRemoveTagFilter: tagFilter => setTagFilters(tagFilters.filter(f => f !== tagFilter))
  }))
)(TagFilterListPresenter);
