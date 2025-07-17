/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Typography } from '@instana/components';
import type { TimeWindow } from '@instana/types';

import { calculateAvailableErrorBudget } from 'in-service-levels/utils/math';
import { minutes } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface TimeBasedErrorBudgetPreviewProps {
  timeWindow: TimeWindow;
  target?: number;
}

export default function TimeBasedErrorBudgetPreview({ timeWindow, target }: TimeBasedErrorBudgetPreviewProps) {
  if (!target) {
    return <Typography variant="body-bold">{t('in-service-levels:createSloDialog.valueMissingTime')}</Typography>;
  }

  const minutesInTimeWindow = calculateAvailableErrorBudget(timeWindow, target);

  return <Typography variant="body-bold">{minutes.fixedCompact(minutesInTimeWindow)}</Typography>;
}
