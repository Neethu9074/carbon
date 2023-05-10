/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { formatDuration } from '@instana/format-date';
import { KeyValue } from '@instana/components';
import { t } from '@instana/i18n-react';

import { calculateAvailableErrorBudget, calculateTimeRemaining } from 'in-service-levels/utils';
import useSloWindowTimeConfig from 'in-service-levels/hooks/useSloWindowTimeConfig';

interface ErrorBudgetInfoProps {
  configuration: ServiceLevelObjectiveConfiguration;
  remainingErrorBudget: number;
}

export default function ErrorBudgetInfo({ configuration, remainingErrorBudget }: ErrorBudgetInfoProps) {
  const { indicator, entity, target, timeWindow } = configuration;
  const { type: entityType } = entity;
  const { type: indicatorType } = indicator;
  const { type: timeWindowType, durationUnit, duration } = timeWindow;

  const timeConfig = useSloWindowTimeConfig(timeWindow);

  // This is only accurate for time based configurations, thus event based configurations won't show an available budget in the status
  const minutesInTimeWindow = calculateAvailableErrorBudget(timeWindow, target);

  return (
    <KeyValue
      label={t('in-service-levels:sloList.components.errorBudgetInfo.timeWindow', {
        context: timeWindowType,
        durationUnit,
        duration,
        remaining: formatDuration(calculateTimeRemaining(timeConfig))
      })}
      value={t('in-service-levels:sloList.components.errorBudgetInfo.budget', {
        context: indicatorType,
        entityType,
        remaining: remainingErrorBudget,
        budget: minutesInTimeWindow
      })}
      inverted
    />
  );
}
