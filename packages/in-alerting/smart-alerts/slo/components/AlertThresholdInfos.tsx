/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelsAlertRuleUnion, StaticThresholdConfig, ServiceLevelsBurnRateTimeWindows } from '@instana/types';
import { KeyValue, Stack } from '@instana/components';

import { percentageUpToTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface AlertThresholdInfosProps {
  threshold: StaticThresholdConfig;
  rule: ServiceLevelsAlertRuleUnion;
  burnRateTimeWindows?: ServiceLevelsBurnRateTimeWindows;
}

export default function AlertThresholdInfos({ threshold, rule, burnRateTimeWindows }: AlertThresholdInfosProps) {
  const { metric } = rule;
  const { value, operator } = threshold;
  const { longTimeWindow, shortTimeWindow } = burnRateTimeWindows ?? {};
  const isBurnRate = metric === 'BURN_RATE';
  const thresholdValue = isBurnRate ? value : percentageUpToTwoDecimalPlaces(value);

  return (
    <Stack distribution="start" direction="horizontal" gap="xxlarge">
      <KeyValue
        label={t('in-alerting:smartAlerts.slo.details.blueprintLabel')}
        value={t('in-alerting:smartAlerts.slo.details.blueprintInfo', {
          context: metric
        })}
        multilineLabel
      />
      <KeyValue
        label={t('in-alerting:smartAlerts.slo.details.thresholdLabel')}
        value={t('in-alerting:smartAlerts.slo.details.thresholdInfo', {
          operator,
          percentage: thresholdValue
        })}
        multilineLabel
      />
      {isBurnRate && longTimeWindow && shortTimeWindow && (
        <>
          <KeyValue
            label={t('in-alerting:smartAlerts.slo.details.longWindowLabel')}
            value={t('in-alerting:smartAlerts.slo.details.timeWindowInfo', {
              context: longTimeWindow.durationType,
              count: longTimeWindow.duration
            })}
            multilineLabel
          />
          <KeyValue
            label={t('in-alerting:smartAlerts.slo.details.shortWindowLabel')}
            value={t('in-alerting:smartAlerts.slo.details.timeWindowInfo', {
              context: shortTimeWindow.durationType,
              count: shortTimeWindow.duration
            })}
            multilineLabel
          />
        </>
      )}
    </Stack>
  );
}
