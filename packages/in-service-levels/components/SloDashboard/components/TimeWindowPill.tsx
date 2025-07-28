/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Tag } from '@instana/carbon';

import locals from './TimeWindowPill.mless';

interface TimeWindowPillProps {
  children: string;
  color?: string;
}

export default function TimeWindowPill({ color, children }: TimeWindowPillProps) {
  return (
    <div className={locals.tagAlign}>
      <Tag type={color}>{children}</Tag>
    </div>
  );
}
