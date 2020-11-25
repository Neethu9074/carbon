import React from 'react';

import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import TagList from 'in-logging/analyze/AnalyzeView/LogDetail/components/TagList';

import locals from './LogContentColumn.mless';

export default function LogContentColumn({ content, tags }) {
  return (
    <div className={locals.wrapper}>
      <span className={locals.content}>{content}</span>

      {tags.length > 0 && (
        <HorizontalFlexWrapper className={locals.tagsWrapper}>
          <TagList tags={tags} />
        </HorizontalFlexWrapper>
      )}
    </div>
  );
}
