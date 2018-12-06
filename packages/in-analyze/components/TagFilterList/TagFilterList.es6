import { withProps } from 'recompose';

import TagFilterListPresenter from 'in-analyze/components/TagFilterList/TagFilterListPresenter';

export default withProps(({ tagFilters, setTagFilters }) => ({
  onRemoveTagFilter: tagFilter => setTagFilters(tagFilters.filter(f => f !== tagFilter))
}))(TagFilterListPresenter);
