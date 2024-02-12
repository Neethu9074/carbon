/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Typography, Pill } from '@instana/components';
import { themes } from '@instana/design-tokens';

import locals from 'in-components/TagsList/TagsList.mless';

interface TagListProps {
  tags: string[];
}

export default function TagList({ tags }: TagListProps) {
  return (
    <div className={locals.tagsWrapper}>
      {tags.map(tag => (
        <Pill className={locals.singleTag} color={themes.default.ids.color.option.neutral['400']} key={tag}>
          <Typography variant="body-small">{tag}</Typography>
        </Pill>
      ))}
    </div>
  );
}
