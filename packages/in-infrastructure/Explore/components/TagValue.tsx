/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { tag_not_present_group } from 'in-infrastructure/Explore/constants';
import Tooltip from 'in-components/Tooltip/Tooltip';

import locals from './TagValue.mless';

export default function TagValue({ value }: { value: string | undefined }) {
  if (!value) {
    return null;
  }
  const displayedValue = value.replace(tag_not_present_group, '-');
  const valueSpan = (
    <span className={locals.value}>
      <bdi>{displayedValue}</bdi>
    </span>
  );

  // take a guess that the content will be truncated, although this is a bit hacky because
  // the truncation happens in CSS
  const labelWithTooltip =
    displayedValue && displayedValue.length > 15 ? (
      <Tooltip content={displayedValue} align="bottomMiddle">
        {valueSpan}
      </Tooltip>
    ) : (
      valueSpan
    );

  return <div className={locals.content}>{labelWithTooltip}</div>;
}
