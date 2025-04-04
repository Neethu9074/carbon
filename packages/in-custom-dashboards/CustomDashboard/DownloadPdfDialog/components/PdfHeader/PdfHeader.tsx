/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { formatDate, formatTimeWithoutSeconds, formatDurationAccurately } from '@instana/format-date';
import { Typography, Stack } from '@instana/components';

import { getAdjustedTimeConfigToIncludeTimestamp } from 'in-stores/time/config';
import { getChartGranularity } from 'in-stores/metric/metric';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/CustomDashboard/DownloadPdfDialog/components/PdfHeader/PdfHeader.mless';

interface Props {
  hidden?: boolean;
}

const PdfHeader = forwardRef(({ hidden = true }: Props, ref: React.LegacyRef<HTMLDivElement>) => {
  const timeConfig = useTimeConfig();
  const currentTime = timeConfig.to ?? Date.now();
  const adjustedTimeConfig = getAdjustedTimeConfigToIncludeTimestamp(timeConfig, currentTime, getChartGranularity);
  const timeFrom = currentTime - adjustedTimeConfig.windowSize;
  const timeFromFormatted = `${formatDate(timeFrom)}, ${formatTimeWithoutSeconds(timeFrom)}`;

  const timeTo = adjustedTimeConfig.to ?? currentTime;
  const timeToFormatted = `${formatDate(timeTo)}, ${formatTimeWithoutSeconds(timeTo)}`;

  const timeZone = new Date().toLocaleDateString('default', { day: '2-digit', timeZoneName: 'short' }).slice(4);
  const timeRangeWithTimezone = `${timeFromFormatted} to ${timeToFormatted} ${timeZone}`;

  return (
    <div
      ref={ref}
      id="pdf-header"
      className={classNames({
        [locals.pdfHeader]: true,
        [locals.hidden]: hidden
      })}
    >
      <div>
        <div className={locals.header}>
          <div className={locals.logo}>
            <Typography variant="heading-03">
              IBM <strong>Instana</strong>
            </Typography>
          </div>
          <Stack direction="horizontal" distribution="end">
            <div className={locals.timeRange}>
              <Stack direction="vertical" gap="disabled" distribution="end">
                <Typography variant="body-02" align="right">
                  {t('in-custom-dashboards:customDashboard.customDashboard.timeRange')}:{' '}
                  {formatDurationAccurately(timeConfig.windowSize)}
                </Typography>
                <Typography variant="body-02" align="right">
                  {timeRangeWithTimezone}
                </Typography>
              </Stack>
            </div>
          </Stack>
        </div>
      </div>
    </div>
  );
});

PdfHeader.displayName = 'PdfHeader';

export default PdfHeader;
