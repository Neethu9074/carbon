/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelsAlertConfigWithMetadata } from '@instana/types';

import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import DefaultCell from 'in-alerting/smart-alerts/components/list/DefaultCell';
import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface AlertTypeColumnProps {
  config: ServiceLevelsAlertConfigWithMetadata;
}

export default function AlertTypeColumn({ config }: AlertTypeColumnProps) {
  const isBurnRateAlert = config.rule.metric === 'BURN_RATE' || config.rule.metric === 'BURN_RATE_V2';

  return (
    <>
      {isBurnRateAlert ? (
        renderBurnRateAlertColumn({ config })
      ) : (
        <DefaultCell
          title={t('in-alerting:smartAlerts.slo.alertList.threshold', {
            value: percentage.detailed(config?.threshold?.value ?? 0),
            operator: config?.threshold?.operator && humanReadableThresholdOperator(config?.threshold?.operator),
            metric:
              config?.rule?.metric === 'BURNED_PERCENTAGE'
                ? t('in-alerting:smartAlerts.slo.alertList.errorBudgetLabel')
                : config.rule.metric === 'STATUS'
                ? t('in-alerting:smartAlerts.slo.alertList.title', { context: config.rule.metric })
                : '',
            context: config.rule.metric
          })}
        />
      )}
    </>
  );
}

function renderBurnRateAlertColumn({ config }: AlertTypeColumnProps) {
  const singleWindowConfig = config?.burnRateConfig?.find(({ alertWindowType }) => alertWindowType === 'SINGLE');
  const longWindowConfig = config?.burnRateConfig?.find(({ alertWindowType }) => alertWindowType === 'LONG');
  const shortWindowConfig = config?.burnRateConfig?.find(({ alertWindowType }) => alertWindowType === 'SHORT');

  if (singleWindowConfig) {
    return (
      <DefaultCell
        title={t('in-alerting:smartAlerts.slo.alertList.singleWindowThreshold', {
          value: singleWindowConfig?.threshold?.value ?? 0,
          context: config.rule.metric,
          operator:
            singleWindowConfig?.threshold?.operator &&
            humanReadableThresholdOperator(singleWindowConfig?.threshold?.operator),
          metric: t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprint', { context: config.rule.metric })
        })}
      />
    );
  }

  if (longWindowConfig && shortWindowConfig) {
    return (
      <>
        <DefaultCell
          title={t('in-alerting:smartAlerts.slo.alertList.longWindowThreshold', {
            shortWindowoperator:
              shortWindowConfig?.threshold?.operator &&
              humanReadableThresholdOperator(shortWindowConfig?.threshold?.operator),
            shortWindowValue: shortWindowConfig?.threshold?.value ?? 0,
            longWindowOperator:
              longWindowConfig?.threshold?.operator &&
              humanReadableThresholdOperator(longWindowConfig?.threshold?.operator),
            longWindowValue: longWindowConfig?.threshold?.value ?? 0,
            context: config.rule.metric,
            metric: t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprint', { context: config.rule.metric })
          })}
        />
      </>
    );
  }
  return (
    <DefaultCell
      title={t('in-alerting:smartAlerts.slo.alertList.threshold', {
        value: config?.threshold?.value,
        operator: config?.threshold?.operator && humanReadableThresholdOperator(config?.threshold?.operator),
        context: config.rule.metric,
        metric: t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprint', { context: config.rule.metric })
      })}
    />
  );
}
