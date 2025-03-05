/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SvgIcon, Stack } from '@instana/components';
import { ForecastingConfig } from '@instana/types';

import { formatDurationAccurately } from 'in-services/formatters/date';
import { Nullish } from 'in-types';
import { Trans } from 'in-i18n';

import locals from './ForecastAlertingDescription.mless';

interface ForecastAlertingDescriptionProps {
  forecastingConfig: ForecastingConfig | Nullish;
}
export default function ForecastAlertingDescription({ forecastingConfig }: ForecastAlertingDescriptionProps) {
  if (!forecastingConfig) {
    return null;
  }

  return (
    <Stack direction="horizontal" align="center" gap="disabled">
      <SvgIcon className={locals.icon} type="lib_openTelemetry" />
      <div className={locals.label}>
        <Trans
          i18nKey="in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.summary"
          values={{
            fitTimeframe: formatTime(forecastingConfig.fitTimeframe),
            forecastTimeframe: formatTime(forecastingConfig.forecastTimeframe)
          }}
        />
      </div>
    </Stack>
  );
}

function formatTime(millis: number) {
  return formatDurationAccurately(millis, 60000, false);
}
