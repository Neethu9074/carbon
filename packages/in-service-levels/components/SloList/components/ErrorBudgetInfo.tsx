/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelIndicatorType, ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';
import { formatDuration } from '@instana/format-date';
import { KeyValue } from '@instana/components';

import useOverlappingTimeWindows from 'in-service-levels/hooks/useOverlappingTimeWindows';
import useSloWindowTimeConfig from 'in-service-levels/hooks/useSloWindowTimeConfig';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { calculateAvailableErrorBudget } from 'in-service-levels/utils/math';
import { calculateTimeRemaining } from 'in-service-levels/utils/time';
import { minutes, number } from 'in-services/formatters/number';
import { hours } from 'in-services/time/time';
import { t } from 'in-i18n';

interface ErrorBudgetInfoProps {
  configuration: ServiceLevelObjectiveConfiguration;
  remainingErrorBudget?: number;
}

export default function ErrorBudgetInfo({ configuration, remainingErrorBudget }: ErrorBudgetInfoProps) {
  const { id: sloConfigId, indicator, entity, target, timeWindow } = configuration;
  const { type: entityType } = entity;
  const { type: indicatorType } = indicator;
  const { type: timeWindowType, durationUnit, duration } = timeWindow;
  // For slo list make sure we always fetch the latest metrics(for past hour)
  const timeConfig: TimeConfig = { autoRefresh: false, windowSize: hours.toMillis(1) };
  const sloTimeConfig = useSloWindowTimeConfig(timeWindow);
  const [timeWindows] = useOverlappingTimeWindows({ sloConfigId, timeConfig });
  const timeRemaining = calculateTimeRemaining(sloTimeConfig, timeConfig, timeWindow.type, timeWindows);

  // This is only accurate for time based configurations, thus event based configurations won't show an available budget in the status
  const minutesInTimeWindow = calculateAvailableErrorBudget(timeWindow, target);

  return (
    <KeyValue
      label={t('in-service-levels:sloList.components.errorBudgetInfo.timeWindow', {
        context: timeWindowType,
        duration,
        durationUnit,
        entityType,
        remaining: remainingErrorBudget == null ? valueMissingPlaceholder : formatDuration(timeRemaining)
      })}
      value={t('in-service-levels:sloList.components.errorBudgetInfo.budget', {
        budget: remainingErrorBudget == null ? valueMissingPlaceholder : minutes.fixedCompact(minutesInTimeWindow),
        context: indicatorType,
        entityType,
        remaining: remainingErrorBudget ?? 0,
        remainingFormatted: formatRemainingBudget(indicatorType, remainingErrorBudget)
      })}
      inverted
    />
  );
}

function formatRemainingBudget(indicatorType?: ServiceLevelIndicatorType, remainingErrorBudget?: number) {
  if (remainingErrorBudget == null) return valueMissingPlaceholder;
  return indicatorType === 'eventBased'
    ? number.compact(remainingErrorBudget)
    : minutes.fixedCompact(remainingErrorBudget);
}
