/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import TagList from 'in-logging/analyze/AnalyzeView/components/TagList';
import Link from 'in-components/Link';

import locals from './LogContentColumn.mless';

export default function LogContentColumn({ onSelectTagHref, content, tags, href }) {
  return (
    <div className={locals.wrapper}>
      <Link className={locals.content} href={href}>
        {content}
      </Link>

      {tags.length > 0 && (
        <HorizontalFlexWrapper className={locals.tagsWrapper}>
          <TagList tags={tags} onSelectTagHref={onSelectTagHref} />
        </HorizontalFlexWrapper>
      )}
    </div>
  );
}
