/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { formatDurationAccurately } from '@instana/format-date';
import { CorrectionConfiguration } from '@instana/types';
import { Typography } from '@instana/components';

import { getDurationInMs } from 'in-service-levels/features/CorrectionWindows/utils/CorrectionConfiguration';

interface DurationColumnContentProps {
  item: CorrectionConfiguration;
}

export default function DurationColumnContent({ item }: DurationColumnContentProps) {
  const durationInMs = getDurationInMs(item);

  return <Typography variant="body-regular">{formatDurationAccurately(durationInMs, undefined, false)}</Typography>;
}
