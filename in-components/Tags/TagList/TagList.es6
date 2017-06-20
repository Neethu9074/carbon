import React from 'react';

import { tagsFilter$ } from 'in-components/Tags/TagList/stores/tagsFilterStore';
import { filteredTags$, filterableTags$ } from 'in-stores/search/keywords/tags';
import TagFilter from 'in-components/Tags/TagList/components/TagFilter';
import connectTo from 'in-hoc/connectTo';
import Tag from 'in-components/Tags/Tag';

import './TagList.less';

const block = 'in-tag-list';

export default connectTo(
  {
    filteredTags: filteredTags$,
    tagsFilter: tagsFilter$,
    tags: filterableTags$
  },
  function TagList({ tags, tagsFilter, filteredTags }) {
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
      const tagToLowerCase = tag.toLowerCase();
      if (tagToLowerCase.indexOf(tagsFilter) === -1) {
        continue;
      }

      const collection = filteredTags.contains(tagToLowerCase) ? activeTags : inactiveTags;
      collection.push(<Tag key={tag} tag={tag} isDark />);
    }

    return (
      <div>
        <div className={block}>
          <div className={block + '__active-tags'}>
            {activeTags}
          </div>
          {inactiveTags}
        </div>
        <TagFilter />
      </div>
    );
  }
);
