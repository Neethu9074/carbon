/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { t } from '@instana/i18n-react';

import { formatDurationAccurately } from 'in-services/formatters/date';

import locals from 'in-alerting/smart-alerts/slo/details/CoolDownPeriodDescription.mless';

interface CoolDownPeriodDescriptionProps {
  coolDownPeriod?: number;
}

export default function CoolDownPeriodDescription({ coolDownPeriod }: CoolDownPeriodDescriptionProps) {
  const formattedTimeToFailure = formatDurationAccurately(coolDownPeriod, 60000, false);
  if (!coolDownPeriod) return <></>;
  return (
    <div className={locals.container}>
      <SvgIcon className={locals.icon} type="lib_datetime_timer" />
      <div>
        <span className={locals.label}>
          {t('in-alerting:smartAlerts.slo.details.coolDownPeriodDescription', {
            value: formattedTimeToFailure
          })}
        </span>
      </div>
    </div>
  );
}
