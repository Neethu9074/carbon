/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration, TimeWindow, isFixedTimeWindow } from '@instana/types';
import { formatDateShort, formatTimeWithoutSeconds } from '@instana/format-date';
import { Card, Stack, Typography } from '@instana/components';

import TimeWindowPill from 'in-service-levels/components/SloDashboard/components/TimeWindowPill';
import { t } from 'in-i18n';

interface TimeWindowCardProps {
  configuration: ServiceLevelObjectiveConfiguration;
}
export default function TimeWindowCard({ configuration }: TimeWindowCardProps) {
  const { timeWindow } = configuration;

  const { duration, durationUnit, type } = timeWindow;
  const startDay = isFixedTimeWindow(timeWindow) && formatDateShort(timeWindow.startTimestamp);
  const startTime = isFixedTimeWindow(timeWindow) && formatTimeWithoutSeconds(timeWindow.startTimestamp);

  return (
    <Card size="s">
      <Stack direction="horizontal" gap="xsmall">
        <Typography noWrap variant="body-regular">
          {t('in-service-levels:sloChart.sloChartSummary.configuredTimeWindow')}
        </Typography>

        <TimeWindowPill>
          {t('in-service-levels:sloChart.sloChartSummary.configuredTimeWindowDetails', {
            duration,
            durationUnit,
            type
          })}
        </TimeWindowPill>
        {isFixedTimeWindow(timeWindow) && (
          <TimeWindowPill>
            {t('in-service-levels:sloChart.sloChartSummary.startTime', {
              startDay,
              startTime
            })}
          </TimeWindowPill>
        )}
      </Stack>
    </Card>
  );
}

export const startToEnd = (timeWindow: TimeWindow) => {
  if (isFixedTimeWindow(timeWindow)) {
    const startDay = formatDateShort(timeWindow.startTimestamp);
    const lastDay = timeWindow.durationUnit === 'week' ? timeWindow.duration * 7 : timeWindow.duration;
    const endDay = formatDateShort(timeWindow.startTimestamp + lastDay * 24 * 60 * 60 * 1000);
    const startEndDate = t('in-service-levels:sloChart.sloChartSummary.startAndEndTimeWindow', { startDay, endDay });
    return startEndDate;
  }
  return;
};
