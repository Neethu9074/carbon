/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ForecastingConfig } from '@instana/types';
import { SvgIcon } from '@instana/components';

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
    <div className={locals.container}>
      <SvgIcon className={locals.icon} type="lib_openTelemetry" />
      <div>
        <span className={locals.label}>
          <Trans
            i18nKey="in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.summary"
            values={{
              fitTimeframe: formatTime(forecastingConfig.fitTimeframe),
              forecastTimeframe: formatTime(forecastingConfig.forecastTimeframe)
            }}
          />
        </span>
        <p>{}</p>
      </div>
    </div>
  );
}

function formatTime(millis: number) {
  return formatDurationAccurately(millis, 60000, false);
}
