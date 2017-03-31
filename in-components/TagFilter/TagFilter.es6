import React from 'react';

import { tagsFilter$, setTagsFilter } from 'in-components/TagFilter/stores/rightSidebarFilterStore';
import connectTo from 'in-hoc/connectTo';

import 'in-components/TagFilter/TagFilter.less';

const block = 'in-tags-filter';

export default connectTo(
  {
    tagsFilter: tagsFilter$
  },
  function TagsFilter({ tagsFilter }) {
    return (
      <div className={block}>
        <input
          placeholder="Search…"
          type="search"
          value={tagsFilter}
          onChange={e => setTagsFilter(e.target.value)}
          className={block + '__input'}
        />
      </div>
    );
  }
);
