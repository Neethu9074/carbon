/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { InfraAlertConfigWithMetadata } from '@instana/types';
import { Message } from '@instana/components';

import { getFormatter, getMetricUnitPostfix } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import InfraThresholdCondition from 'in-alerting/smart-alerts/infrastructure/components/InfraThresholdCondition';
import { chartViewConfigs as defaultChartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { alertConfigWithDefaultThreshold } from 'in-alerting/smart-alerts/components/utils/formUtils';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import BorderedContainer from 'in-alerting/components/BorderedContainer';
import { t } from 'in-i18n';

export interface ThresholdProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex?: number;
}

export default function ThresholdSelectionInteractiveChart({
  form,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}: ThresholdProps): JSX.Element {
  const chartViewConfigs = defaultChartViewConfigs;
  const alertConfigWithFormModel = alertConfigWithDefaultThreshold(form) as InfraAlertConfigWithMetadata;

  const {
    rule: { entityType, metricName }
  } = alertConfigWithFormModel;

  const formatter = getFormatter(entityType, metricName);
  const percentageMetric = formatter === 'PERCENTAGE';
  const metricUnitPostfix = getMetricUnitPostfix(formatter);

  return (
    <BorderedContainer>
      <InfraThresholdCondition
        form={form}
        updateForm={updateForm}
        percentageMetric={percentageMetric}
        metricUnitPostfix={metricUnitPostfix}
      />
      <ChartViewConfigurator
        chartViewConfigs={chartViewConfigs}
        onChartViewConfigChange={index => (onChartViewConfigChange ? onChartViewConfigChange(index) : null)}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        title={t('in-alerting:smartAlerts.infrastructure.alertDetails.alertConfigurationTitleTrigger')}
        doNotSetDefaultHeight
        framed
      >
        {() => (
          <>
            <Message withIcon>{t('in-alerting:smartAlerts.infrastructure.form.noMetricSelected')}</Message>
          </>
        )}
      </ChartViewConfigurator>
    </BorderedContainer>
  );
}
