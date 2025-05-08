/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { formatDate, formatTimeWithoutSeconds, formatDurationAccurately } from '@instana/format-date';
import { Typography, Stack } from '@instana/components';

import { getAdjustedTimeConfigToIncludeTimestamp } from 'in-stores/time/config';
import { pdfHeader } from 'in-components/DownloadPdf/utils/constants';
import { getChartGranularity } from 'in-stores/metric/metric';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-components/DownloadPdf/components/PdfHeader/PdfHeader.mless';

interface Props {
  orientation?: string;
}

export default function PdfHeader({ orientation }: Readonly<Props>) {
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
      id={pdfHeader}
      data-testid={pdfHeader}
      aria-hidden="true"
      className={classNames({
        [locals.pdfHeader]: true,
        [locals.landscape]: Boolean(orientation === 'l')
      })}
    >
      <div className={locals.header}>
        <div className={locals.logo}>
          <Typography variant="heading-03" component="div">
            IBM <strong>Instana</strong>
          </Typography>
        </div>
        <Stack direction="horizontal" distribution="end">
          <div className={locals.timeRange}>
            <Stack direction="vertical" gap="disabled" distribution="end">
              <Typography variant="body-02" align="right">
                {t('in-components:downloadPdf.timeRange')}: {formatDurationAccurately(timeConfig.windowSize)}
              </Typography>
              <Typography variant="body-02" align="right">
                {timeRangeWithTimezone}
              </Typography>
            </Stack>
          </div>
        </Stack>
      </div>
    </div>
  );
}
