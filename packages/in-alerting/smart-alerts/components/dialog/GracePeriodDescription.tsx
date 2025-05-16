/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SvgIcon, Stack } from '@instana/components';

import { formatDurationAccurately } from 'in-services/formatters/date';
import { Granularity, Nullish } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/GracePeriodDescription.mless';

interface GracePeriodDescriptionProps {
  gracePeriod: number | Nullish;
  granularity?: Granularity;
}

export default function GracePeriodDescription({ gracePeriod, granularity }: GracePeriodDescriptionProps) {
  const computeGracePeriod = getComputeGracePeriod(gracePeriod, granularity);
  if (!computeGracePeriod) {
    return null;
  }

  return (
    <Stack direction="horizontal" align="center" gap="disabled">
      <SvgIcon className={locals.icon} type="lib_datetime_timer" />
      <Stack gap="disabled">
        <div className={locals.label}>{t('in-alerting:smartAlerts.components.gracePeriod.summary')}</div>
        <div>{formatDurationAccurately(computeGracePeriod, 60000, false)}</div>
      </Stack>
    </Stack>
  );
}

function getComputeGracePeriod(gracePeriod: number | Nullish, granularity?: Granularity) {
  if (!granularity) {
    return gracePeriod;
  }
  return !gracePeriod ? 0 : gracePeriod - granularity;
}
