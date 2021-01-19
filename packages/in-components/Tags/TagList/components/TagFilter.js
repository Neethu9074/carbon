/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import './TagFilter.less';

const block = 'in-tags-filter';

export default function TagsFilter({ tagsFilter, onChange }) {
  return (
    <input
      className={block}
      placeholder="Search…"
      type="search"
      value={tagsFilter}
      onChange={e => onChange(e.target.value)}
    />
  );
}
