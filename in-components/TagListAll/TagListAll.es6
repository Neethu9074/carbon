import React from 'react';

import {tagsFilter$} from 'in-components/TagFilter/stores/rightSidebarFilterStore';
import {filterableTags$} from 'in-stores/search/tags';
import connectTo from 'in-hoc/connectTo';
import Tag from 'in-components/Tag';

import 'in-components/TagListAll/TagListAll.less';


const block = 'in-tag-list-all';

export default connectTo({
  tags: filterableTags$,
  tagsFilter: tagsFilter$
},
function TagListAll({tags, tagsFilter}) {
  if (!tags || tags.size === 0) {
    return (
      <div className={block + '__no-tags'}>
        There are no tags defined
      </div>
    );
  }

  tags = tags.toArray();
  tagsFilter = tagsFilter.toLowerCase();

  if (tagsFilter.length > 0) {
    tags = tags.filter(tag => tag.toLowerCase().indexOf(tagsFilter) !== -1);
  }

  return (
    <div className={block}>
      {tags.map(tag =>
        <Tag key={tag}
             tag={tag}
             isDark={true}/>
      )}
    </div>
  );
});
