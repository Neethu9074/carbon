import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import TagList from 'in-logging/analyze/AnalyzeView/LogDetail/components/TagList';
import Link from 'in-components/Link';

import locals from './LogContentColumn.mless';

export default function LogContentColumn({ content, tags, href }) {
  return (
    <div className={locals.wrapper}>
      <h4 className={locals.header}>Message</h4>
      <Link className={locals.content} href={href}>
        {content}
      </Link>

      {tags.length > 0 && (
        <HorizontalFlexWrapper className={locals.tagsWrapper}>
          <TagList tags={tags} />
        </HorizontalFlexWrapper>
      )}
    </div>
  );
}
