/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { formatDurationAccurately } from 'in-services/formatters/date';
import { PredictiveTrigger, Nullish } from 'in-types';
import { t } from 'in-i18n';

import locals from './PredictiveTriggerDescription.mless';

interface PredictiveTriggerDescriptionProps {
  predictiveTrigger: PredictiveTrigger | Nullish;
}
export default function PredictiveTriggerDescription(props: PredictiveTriggerDescriptionProps) {
  const timeToFailure = props.predictiveTrigger?.timeToFailure;

  if (!timeToFailure) {
    return null;
  }

  const formattedTimeToFailure = formatDurationAccurately(timeToFailure, 60000, false);
  return (
    <div className={locals.container}>
      <SvgIcon className={locals.icon} type="lib_openTelemetry" />
      <div>
        <span className={locals.label}>
          {t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.alertTitle', {
            value: formattedTimeToFailure
          })}
        </span>
        <p>{}</p>
      </div>
    </div>
  );
}
