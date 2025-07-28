/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Tag } from '@instana/carbon';
import { Stack } from '@instana/components';

interface TimeWindowPillProps {
  children: string;
  color?: string;
}

export default function TimeWindowPill({ color, children }: TimeWindowPillProps) {
  return (
    <Tag type={color} size="sm">
      <Stack gap="xxsmall" direction="horizontal">
        {children}
      </Stack>
    </Tag>
  );
}
