/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import TagGroup from 'in-analyze/AnalyzeView/components/TagGroup';

import localsShared from './TagSharedList.mless';
import locals from './TagGroupList.mless';

/**
 * The "list" of tag groups.
 * The tag group, of which there can only be one, is passed to a stylized list.
 * This is done to stay consistent with TagFilterList.
 */
export default function TagGroupList({ tagGroupEntry }) {
  if (tagGroupEntry.tag == null) {
    return null;
  }

  return (
    <div className={locals.tagGroupListWrapper}>
      <ul className={localsShared.tagList}>
        <li key={0} className={localsShared.item}>
          <TagGroup tagGroupEntry={tagGroupEntry} index={0} readonly={false} />
        </li>
      </ul>
    </div>
  );
}
