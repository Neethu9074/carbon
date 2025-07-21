/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// eslint-disable-next-line no-restricted-imports
import { ActionableNotification } from '@carbon/react';
import React, { useState } from 'react';

import type { ServiceLevelObjectiveConfiguration, TimeWindow } from '@instana/types';
import { formatDateShort, formatTimeWithoutSeconds } from '@instana/format-date';
import { Card, Stack, Typography } from '@instana/components';
import { isFixedTimeWindow } from '@instana/types';

import { buildTimezoneFromLocationName, getCurrentFormattedTimezone } from 'in-service-levels/utils/timezone';
import TimeWindowPill from 'in-service-levels/components/SloDashboard/components/TimeWindowPill';
import ConfigureSloDialog from 'in-service-levels/components/ConfigDialog/ConfigureSloDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { utcLabel } from 'in-service-levels/constants';
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
  const [isNotificationVisible, setNotificationVisible] = useState(true);

  const sloTimezone = timeWindow?.timezone ? timeWindow.timezone : utcLabel;

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
        {buildTimezoneFromLocationName(sloTimezone) !== getCurrentFormattedTimezone() && isNotificationVisible && (
          <div className={locals.toastContainer}>
            <ActionableNotification
              inline
              actionButtonLabel={t('in-service-levels:sloChart.sloChartSummary.editSloTimezone')}
              onActionButtonClick={openEditDialog}
              onCloseButtonClick={() => setNotificationVisible(false)}
              kind="info"
              lowContrast
              title={t('in-service-levels:sloChart.sloChartSummary.sloCreatedTimezone', { sloTimezone })}
              subtitle={t('in-service-levels:sloChart.sloChartSummary.currentTimezone', {
                timezone: getCurrentFormattedTimezone()
              })}
            />
          </div>
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
