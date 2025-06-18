/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CorrectionConfiguration } from '@instana/types';
import { formatDateTime } from '@instana/format-date';
import { Typography } from '@instana/components';

import { getNextOccurence } from 'in-service-levels/features/CorrectionWindows/utils/CorrectionConfiguration';

interface NextOccurrenceColumnContentProps {
  item: CorrectionConfiguration;
}

export default function NextOccurrenceColumnContent({ item }: NextOccurrenceColumnContentProps) {
  const startTime = new Date(item.scheduling?.startTime ?? '');
  const now = new Date();
  const nextOccurrence = getNextOccurence(item);
  const hasOneTimeOccured = item.scheduling?.recurrent === false && startTime < now;
  // TODO: translate this
  return <Typography variant="body-regular">{hasOneTimeOccured ? null : formatDateTime(nextOccurrence)}</Typography>;
}
