/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Card, LoadingSkeleton, Stack, Typography } from '@instana/components';
import { formatDateShort } from '@instana/format-date';
import type { TimeConfig } from '@instana/types';
import { Tag } from '@instana/carbon';

import TimeWindowPill from 'in-service-levels/components/SloDashboard/components/TimeWindowPill';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { t } from 'in-i18n';

export default function MatchingSloTimeWindowsCard() {
  const { timeWindows, timeWindowColors, progress } = useSloTimeWindowContext();

  const matchingTimeWindows = calculateMatchTimeWindow(timeWindows);
  const hasMatchingTimeWindows = timeWindows.length > 0;
  const isLoading = progress.loading;

  return (
    <Card>
      <Stack gap="xsmall" direction="vertical" wrap>
        <Typography noWrap variant="body-regular">
          {t('in-service-levels:sloChart.sloChartSummary.matchedSLOTimeWindow', { count: timeWindows.length })}
        </Typography>
        <Stack gap="xxsmall" direction="horizontal" wrap>
          {matchingTimeWindows.map((timeWindow, index) => {
            return (
              <TimeWindowPill color={timeWindowColors[index]} key={index}>
                {timeWindow}
              </TimeWindowPill>
            );
          })}
        </Stack>
        {!isLoading && !hasMatchingTimeWindows && (
          <Tag size="sm">{t('in-service-levels:sloChart.sloChartSummary.noMatchedSLOTimeWindow')}</Tag>
        )}
        {isLoading && <LoadingSkeleton />}
      </Stack>
    </Card>
  );
}

export const calculateMatchTimeWindow = (timeWindows: TimeConfig[]) => {
  const now = Date.now();
  const formatedTimeWindow = timeWindows.map((timeWindow: TimeConfig) => {
    const selectedTo = timeWindow.to ?? now;
    const end = timeWindow.windowSize;
    const firstDate = formatDateShort(selectedTo - end);
    const endDate = formatDateShort(selectedTo);
    const matchedTimeWindow = t('in-service-levels:sloChart.sloChartSummary.startAndEndTimeWindow', {
      firstDate,
      endDate
    });
    return matchedTimeWindow;
  });
  return formatedTimeWindow;
};
