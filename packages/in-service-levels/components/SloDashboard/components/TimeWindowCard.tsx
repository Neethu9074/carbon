/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import type { ServiceLevelObjectiveConfiguration, TimeWindow } from '@instana/types';
import { formatDateShort, formatTimeWithoutSeconds } from '@instana/format-date';
import { Card, Stack, Typography } from '@instana/components';
import { isFixedTimeWindow } from '@instana/types';
import { Tag } from '@instana/carbon';

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
      <Stack direction="vertical" gap="xsmall">
        <Typography noWrap variant="body-regular">
          {t('in-service-levels:sloChart.sloChartSummary.configuredTimeWindow')}
        </Typography>
        <Stack gap="xxsmall" direction="horizontal" wrap>
          <Tag size="sm">
            {t('in-service-levels:sloChart.sloChartSummary.configuredTimeWindowDetails', {
              duration,
              durationUnit,
              type
            })}
          </Tag>
          {isFixedTimeWindow(timeWindow) && (
            <Tag size="sm">
              {t('in-service-levels:sloChart.sloChartSummary.startTime', {
                startDay,
                startTime
              })}
            </Tag>
          )}
        </Stack>
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
