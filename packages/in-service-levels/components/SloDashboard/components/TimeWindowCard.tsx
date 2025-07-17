/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration, TimeWindow, isFixedTimeWindow } from '@instana/types';
import { formatDateShort, formatTimeWithoutSeconds } from '@instana/format-date';
import { CarbonCallout, Card, Stack, Typography } from '@instana/components';

// @ts-ignore
// eslint-disable-next-line no-restricted-imports
import moment from 'in-services/moment-timezone';
import TimeWindowPill from 'in-service-levels/components/SloDashboard/components/TimeWindowPill';
import ConfigureSloDialog from 'in-service-levels/components/ConfigDialog/ConfigureSloDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { t } from 'in-i18n';

import locals from './TimeWindowCard.mless';

interface TimeWindowCardProps {
  configuration: ServiceLevelObjectiveConfiguration;
}
export default function TimeWindowCard({ configuration }: TimeWindowCardProps) {
  const meta = { productArea: productAreas.slo, pageName: pageNames.service_levels };

  const { timeWindow } = configuration;

  const { duration, durationUnit, type } = timeWindow;
  const startDay = isFixedTimeWindow(timeWindow) && formatDateShort(timeWindow.startTimestamp);
  const startTime = isFixedTimeWindow(timeWindow) && formatTimeWithoutSeconds(timeWindow.startTimestamp);

  const sloTimezone = 'UTC'; //get this from BE

  const getFormattedTimeZone = () => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = moment.tz(tz).format('Z');
    return `UTC${offset} ${tz}`;
  };

  // console.log('>>>>>>configuration', configuration);

  const openEditDialog = () => {
    addActiveDialog(<ConfigureSloDialog mode="EDIT" configuration={configuration} trackingMeta={meta} />);
  };

  return (
    <Card size="s">
      <Stack direction="vertical" gap="small">
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
          <TimeWindowPill>{t('in-service-levels:sloChart.sloChartSummary.timezone', { sloTimezone })}</TimeWindowPill>
        </Stack>
        {sloTimezone !== getFormattedTimeZone() && (
          <CarbonCallout
            className={locals.toastContainer}
            actionButtonLabel={t('in-service-levels:sloChart.sloChartSummary.editSloTimezone')}
            onActionButtonClick={openEditDialog}
            titleId="edit-slo-time-zone"
            kind="info"
            lowContrast
            title={t('in-service-levels:sloChart.sloChartSummary.sloCreatedTimezone', { sloTimezone })}
            subtitle={t('in-service-levels:sloChart.sloChartSummary.currentTimezone', {
              currentTimezone: getFormattedTimeZone()
            })}
          />
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
