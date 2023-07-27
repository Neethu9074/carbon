/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Typography, useTheme } from '@instana/components';

import Pill from 'in-components/Pill';

import locals from 'in-service-levels/components/TagsList/SloTagsList.mless';

interface SloTagListProps {
  tags: string[];
}
export default function SloTagList({ tags }: SloTagListProps) {
  const theme = useTheme();
  return (
    <div className={locals.tagsWrapper}>
      {tags.map(tag => (
        <Pill className={locals.singleTag} color={theme.ids.color.option.neutral[400]} key={tag}>
          <Typography variant="body-small">{tag}</Typography>
        </Pill>
      ))}
    </div>
  );
}
