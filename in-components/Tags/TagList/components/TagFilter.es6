import React from 'react';

import { tagsFilter$, setTagsFilter } from 'in-components/Tags/TagList/stores/tagsFilterStore';
import connectTo from 'in-hoc/connectTo';

import './TagFilter.less';

const block = 'in-tags-filter';

export default connectTo(
  {
    tagsFilter: tagsFilter$
  },
  function TagsFilter({ tagsFilter }) {
    return (
      <input
        className={block}
        placeholder="Search…"
        type="search"
        value={tagsFilter}
        onChange={e => setTagsFilter(e.target.value)}
      />
    );
  }
);
