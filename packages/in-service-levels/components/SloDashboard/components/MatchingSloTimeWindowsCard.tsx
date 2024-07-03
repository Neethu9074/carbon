/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Card, LoadingSkeleton, Stack, Typography } from '@instana/components';
import { formatDateShort } from '@instana/format-date';
import { TimeConfig } from '@instana/types';
import { t } from '@instana/i18n-react';

import TimeWindowPill from 'in-service-levels/components/SloDashboard/components/TimeWindowPill';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';

export default function MatchingSloTimeWindowsCard() {
  const { timeWindows, timeWindowColors, progress } = useSloTimeWindowContext();

  const matchingTimeWindows = calculateMatchTimeWindow(timeWindows);
  const hasMatchingTimeWindows = timeWindows.length > 0;
  const isLoading = progress.loading;

  return (
    <Card>
      <Stack gap="xxsmall" direction="horizontal" wrap>
        <Typography noWrap variant="body-regular">
          {t('in-service-levels:sloChart.sloChartSummary.matchedSLOTimeWindow')}
        </Typography>

        {matchingTimeWindows.map((timeWindow, index) => {
          return (
            <TimeWindowPill withDark color={timeWindowColors[index]} key={index}>
              {timeWindow}
            </TimeWindowPill>
          );
        })}
        {!isLoading && !hasMatchingTimeWindows && (
          <TimeWindowPill color="default.ids.color.option.neutral.400">No matching time window found</TimeWindowPill>
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
