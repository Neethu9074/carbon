/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SvgIcon, Stack } from '@instana/components';

import { formatDurationAccurately } from 'in-services/formatters/date';
import { Nullish } from 'in-types';
import { Trans } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/GracePeriodDescription.mless';

interface GracePeriodDescriptionProps {
  gracePeriod: number | Nullish;
}

export default function GracePeriodDescription({ gracePeriod }: GracePeriodDescriptionProps) {
  if (!gracePeriod) {
    return null;
  }
  return (
    <Stack direction="horizontal" align="center" gap="disabled">
      <SvgIcon className={locals.icon} type="lib_datetime_timer" />
      <div>
        <span className={locals.label}>
          <Trans
            i18nKey="in-alerting:smartAlerts.components.gracePeriod.summary"
            values={{
              gracePeriodValue: formatDurationAccurately(gracePeriod, 60000, false)
            }}
          />
        </span>
      </div>
    </Stack>
  );
}
