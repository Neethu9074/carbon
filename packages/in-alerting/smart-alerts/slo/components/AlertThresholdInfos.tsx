/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelsAlertRuleUnion, StaticThresholdConfig } from '@instana/types';
import { KeyValue, Stack } from '@instana/components';

import { percentageUpToTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface AlertThresholdInfosProps {
  threshold: StaticThresholdConfig;
  rule: ServiceLevelsAlertRuleUnion;
}

export default function AlertThresholdInfos({ threshold, rule }: AlertThresholdInfosProps) {
  const { metric } = rule;
  const { value, operator } = threshold;
  const thresholdValue = metric === 'BURN_RATE' ? value : percentageUpToTwoDecimalPlaces(value);

  return (
    <Stack direction="horizontal" gap="large">
      <KeyValue
        label={t('in-alerting:smartAlerts.slo.details.blueprintLabel')}
        value={t('in-alerting:smartAlerts.slo.details.thresholdInfo', {
          context: metric,
          operator,
          percentage: thresholdValue
        })}
        multilineLabel
      />
    </Stack>
  );
}
