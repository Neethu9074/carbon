/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import './TagFilter.less';

const block = 'in-tags-filter';

export default function TagsFilter({ tagsFilter, onChange }) {
  return (
    <input
      className={block}
      placeholder={t('in-components:tags.tagFilterSearchPlaceholder')}
      type="search"
      value={tagsFilter}
      onChange={e => onChange(e.target.value)}
    />
  );
}
