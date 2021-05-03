/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Button } from '@instana/components';

import TagFilter from 'in-components/Tags/TagList/components/TagFilter';
import getFilterableTags from 'in-subscription/getFilterableTags';
import { filteredTags$ } from 'in-stores/search/keywords/tags';
import { number } from 'in-services/formatters/number';
import { emptySet } from 'in-services/fixedImmutables';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Tag from 'in-components/Tags/Tag';
import { t } from 'in-i18n';

import locals from './TagList.mless';

const maxTagsPerCollection = 200;

export default connectTo(
  {
    filteredTags: filteredTags$,
    tags: timeConfig$.flatMap(getFilterableTags)
  },
  function TagList({ tags, filteredTags = emptySet }) {
    const [tagsFilter, setTagsFilter] = useState('');

    if (!tags || tags.size === 0) {
      return <div className={locals.noTags}>{t('in-components:tags.tagListNoTagsDefined')}</div>;
    }

    tags = tags.toArray();

    const activeTags = [];
    const inactiveTags = [];

    const lowerCaseTagsFilter = tagsFilter.toLowerCase();
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i];
      const tagToLowerCase = tag.toLowerCase();
      if (tagToLowerCase.indexOf(lowerCaseTagsFilter) === -1) {
        continue;
      }

      const isActive = filteredTags.contains(tagToLowerCase);
      const collection = isActive ? activeTags : inactiveTags;
      collection.push(<Tag key={tag} tag={tag} isDark active={isActive} />);
    }

    return (
      <>
        <div className={locals.list}>
          <div className={locals.activeTags}>
            <TagListWithMaxLengthRestriction tags={activeTags} />
          </div>

          <TagListWithMaxLengthRestriction tags={inactiveTags} />
        </div>
        <TagFilter value={tagsFilter} onChange={setTagsFilter} />
      </>
    );
  }
);

function TagListWithMaxLengthRestriction({ tags }) {
  const [showAll, setShowAll] = useState(false);
  const actualNumberOfTags = tags.length;

  if (!showAll) {
    tags = tags.slice(0, maxTagsPerCollection);
  }

  return (
    <>
      {tags}

      {actualNumberOfTags > maxTagsPerCollection && !showAll && (
        <Button className={locals.button} size="compact" onClick={() => setShowAll(true)}>
          {t('in-components:tags.tagListShowAll', { num: number.compact(actualNumberOfTags - maxTagsPerCollection) })}
        </Button>
      )}
    </>
  );
}
