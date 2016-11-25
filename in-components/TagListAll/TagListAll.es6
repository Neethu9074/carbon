import React from 'react';

import {tagsFilter$} from 'in-components/TagFilter/stores/rightSidebarFilterStore';
import {filterableTags$} from 'in-stores/search/tags';
import {filteredTags$} from 'in-stores/search/tags';
import connectTo from 'in-hoc/connectTo';
import Tag from 'in-components/Tag';

import 'in-components/TagListAll/TagListAll.less';


const block = 'in-tag-list-all';

export default connectTo({
  filteredTags: filteredTags$,
  tagsFilter: tagsFilter$,
  tags: filterableTags$
},
function TagListAll({tags, tagsFilter, filteredTags}) {
  if (!tags || tags.size === 0) {
    return (
      <div className={block + '__no-tags'}>
        There are no tags defined
      </div>
    );
  }

  tags = tags.toArray();
  tagsFilter = tagsFilter.toLowerCase();

  const activeTags = [];
  const inactiveTags = [];

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (tag.toLowerCase().indexOf(tagsFilter) === -1) {
      continue;
    }

    const collection = filteredTags.contains(tag.toLowerCase())
      ? activeTags
      : inactiveTags;

    collection.push(<Tag key={tag}
                         tag={tag}
                         isDark />);
  }

  return (
    <div className={block}>
      <div className={block + '__active-tags'}>
        {activeTags}
      </div>
      {inactiveTags}
    </div>
  );
});
