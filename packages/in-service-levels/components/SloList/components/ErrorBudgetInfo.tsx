/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';
import { isEventBasedSli } from '@instana/types/typeDefinitions';
import { formatDuration } from '@instana/format-date';
import { KeyValue } from '@instana/components';
import { t } from '@instana/i18n-react';

import useSloWindowTimeConfig from 'in-service-levels/hooks/useSloWindowTimeConfig';
import { calculateAvailableErrorBudget } from 'in-service-levels/utils/math';
import { calculateTimeRemaining } from 'in-service-levels/utils/time';
import { minutes, number } from 'in-services/formatters/number';

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
        remainingFormatted: isEventBasedSli(indicator)
          ? number.compact(remainingErrorBudget)
          : minutes.fixedCompact(remainingErrorBudget),
        budget: minutes.fixedCompact(minutesInTimeWindow)
      })}
      inverted
    />
  );
}
