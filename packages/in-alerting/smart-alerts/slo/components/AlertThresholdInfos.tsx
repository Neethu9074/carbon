/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  ServiceLevelsAlertRuleUnion,
  StaticThresholdConfig,
  ServiceLevelsBurnRateConfig,
  ServiceLevelsBurnRateTimeWindows
} from '@instana/types';
import { KeyValue, Stack } from '@instana/components';

import { percentageUpToTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface AlertThresholdInfosProps {
  threshold?: StaticThresholdConfig;
  rule: ServiceLevelsAlertRuleUnion;
  burnRateTimeWindows?: ServiceLevelsBurnRateTimeWindows;
  burnRateConfig?: ServiceLevelsBurnRateConfig[];
}

export default function AlertThresholdInfos({
  threshold,
  rule,
  burnRateTimeWindows,
  burnRateConfig
}: AlertThresholdInfosProps) {
  const { metric } = rule;
  const { value, operator } = threshold ?? {};
  const { longTimeWindow, shortTimeWindow } = burnRateTimeWindows ?? {};
  const isBurnRateV2 = metric === 'BURN_RATE_V2';
  const isBurnRateV1 = metric === 'BURN_RATE';

  const thresholdValue = isBurnRateV1 ? value : percentageUpToTwoDecimalPlaces(value ?? 0);
  const singleWindowBurnRateConfig = burnRateConfig?.find(({ alertWindowType }) => alertWindowType === 'SINGLE');
  const longWindowBurnRateConfig = burnRateConfig?.find(({ alertWindowType }) => alertWindowType === 'LONG');
  const shortWindowBurnRateConfig = burnRateConfig?.find(({ alertWindowType }) => alertWindowType === 'SHORT');

  return (
    <Stack distribution="start" direction="horizontal" gap="xxlarge">
      <KeyValue
        label={t('in-alerting:smartAlerts.slo.details.blueprintLabel')}
        value={t('in-alerting:smartAlerts.slo.details.blueprintInfo', {
          context: metric
        })}
        multilineLabel
      />
      {metric !== 'BURN_RATE_V2' && (
        <KeyValue
          label={t('in-alerting:smartAlerts.slo.details.thresholdLabel')}
          value={t('in-alerting:smartAlerts.slo.details.thresholdInfo', {
            operator,
            percentage: thresholdValue
          })}
          multilineLabel
        />
      )}
      {isBurnRateV1 && longTimeWindow && shortTimeWindow && (
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
      {isBurnRateV2 && (
        <>
          {singleWindowBurnRateConfig ? (
            <>
              <KeyValue
                label={t('in-alerting:smartAlerts.slo.details.singleWindowLabel')}
                value={t('in-alerting:smartAlerts.slo.details.timeWindowInfo', {
                  context: singleWindowBurnRateConfig?.durationUnitType,
                  count: singleWindowBurnRateConfig?.duration
                })}
                multilineLabel
              />
              <KeyValue
                label={t('in-alerting:smartAlerts.slo.details.thresholdLabel')}
                value={t('in-alerting:smartAlerts.slo.details.thresholdInfo', {
                  operator: singleWindowBurnRateConfig?.threshold?.operator,
                  percentage: singleWindowBurnRateConfig?.threshold?.value
                })}
                multilineLabel
              />
            </>
          ) : (
            <>
              <KeyValue
                label={t('in-alerting:smartAlerts.slo.details.longWindowLabel')}
                value={t('in-alerting:smartAlerts.slo.details.timeWindowInfo', {
                  context: longWindowBurnRateConfig?.durationUnitType,
                  count: longWindowBurnRateConfig?.duration
                })}
                multilineLabel
              />
              <KeyValue
                label={t('in-alerting:smartAlerts.slo.details.thresholdLabel')}
                value={t('in-alerting:smartAlerts.slo.details.thresholdInfo', {
                  operator: longWindowBurnRateConfig?.threshold?.operator,
                  percentage: longWindowBurnRateConfig?.threshold?.value
                })}
                multilineLabel
              />

              <KeyValue
                label={t('in-alerting:smartAlerts.slo.details.shortWindowLabel')}
                value={t('in-alerting:smartAlerts.slo.details.timeWindowInfo', {
                  context: shortWindowBurnRateConfig?.durationUnitType,
                  count: shortWindowBurnRateConfig?.duration
                })}
                multilineLabel
              />
              <KeyValue
                label={t('in-alerting:smartAlerts.slo.details.thresholdLabel')}
                value={t('in-alerting:smartAlerts.slo.details.thresholdInfo', {
                  operator: shortWindowBurnRateConfig?.threshold?.operator,
                  percentage: shortWindowBurnRateConfig?.threshold?.value
                })}
                multilineLabel
              />
            </>
          )}
        </>
      )}
    </Stack>
  );
}
