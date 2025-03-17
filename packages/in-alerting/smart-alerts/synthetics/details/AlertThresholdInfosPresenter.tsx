/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { KeyValue } from '@instana/components';
import { Stack } from '@instana/components';

import GracePeriodDescription from 'in-alerting/smart-alerts/components/dialog/GracePeriodDescription';
import { t } from 'in-i18n';

import locals from './AlertThresholdInfosPresenter.mless';

interface Props {
  thresholdTypeLabel: string;
  metricLabel: string;
  scopeLabel: string;
  gracePeriod?: number;
}

export const AlertThresholdInfosPresenter = ({ thresholdTypeLabel, metricLabel, scopeLabel, gracePeriod }: Props) => {
  return (
    <Stack gap="large">
      <Stack direction="horizontal" distribution="stretch">
        <KeyValue
          label={t('in-alerting:smartAlerts.synthetics.details.alertingType')}
          value={thresholdTypeLabel}
          className={locals.keyValueExtraGap}
          multilineLabel
        />
        <KeyValue
          label={t('in-alerting:smartAlerts.synthetics.details.timeThreshold')}
          value={metricLabel}
          className={locals.keyValueExtraGap}
          multilineLabel
        />
        <KeyValue
          label={t('in-alerting:smartAlerts.details.entityTitle')}
          value={scopeLabel}
          className={locals.keyValueExtraGap}
          multilineLabel
        />
      </Stack>
      {gracePeriod && <GracePeriodDescription gracePeriod={gracePeriod} />}
    </Stack>
  );
};
