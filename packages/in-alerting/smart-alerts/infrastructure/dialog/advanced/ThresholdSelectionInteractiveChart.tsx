/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Message } from '@instana/components';
import { Order } from '@instana/types';

import { getFormatter, getMetricUnitPostfix } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import InfraThresholdCondition from 'in-alerting/smart-alerts/infrastructure/components/InfraThresholdCondition';
import { chartViewConfigs as defaultChartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import InfraMetricGroup from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricGroup';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import BorderedContainer from 'in-alerting/components/BorderedContainer';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getPluginName } from 'in-sdk/pluginName';
import { AggregationType } from 'in-types';
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

  const granularity = form.get('granularity').value;
  const tagFilterExpression = form.get('tagFilterExpression').value;
  const groupBy = form.get('groupBy').value;

  const ruleForm = form.get('rule');
  const entityType = ruleForm.get('entityType').value;
  const metricName = ruleForm.get('metricName').value;
  const aggregation = ruleForm.get('aggregation').value;

  const crossSeriesAggregation = ruleForm.get('crossSeriesAggregation').value;

  const formatter = getFormatter(entityType, metricName);
  const percentageMetric = formatter === 'PERCENTAGE';
  const metricUnitPostfix = getMetricUnitPostfix(formatter);
  const entityLabel = getPluginName(entityType, 1);

  const backendGroupBy = groupBy?.map((groups: any) => groups?.groupbyTag) ?? [];
  const order = { by: backendGroupBy?.[0], direction: 'DESC' };
  const metrics = getMetrics(metricName, aggregation, crossSeriesAggregation, entityLabel);
  const backendQueryModel = toBackendQueryModel(tagFilterExpression);

  let timeConfig = useTimeConfig();
  timeConfig = { ...timeConfig, to: Date.now(), focusedMoment: Date.now() };

  const kpiDefinitions = getKpiDefinitions(entityType);
  const metricMetadatas = useMetricMetadatas({ type: entityType, queries: [metrics[0].metric], kpiDefinitions });

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
      {groupBy.length > 0 && (
        <InfraMetricGroup
          granularity={granularity}
          backendQueryModel={backendQueryModel}
          backendGroupBy={backendGroupBy}
          order={order as Order}
          type={entityType}
          metrics={metrics}
          groupBy={backendGroupBy}
          timeConfig={timeConfig}
          metricMetadatas={metricMetadatas}
        />
      )}
    </BorderedContainer>
  );
}

export interface MetricType {
  metric: string;
  aggregation: AggregationType;
  crossSeriesAggregation: AggregationType;
  regex: boolean;
  label?: string;
}

/**
 * Gets the metrics.
 * @param metricName The metric name.
 * @param aggregation The aggregation.
 * @param crossSeriesAggregation The cross series aggregation.
 * @param entityLabel The entity label.
 * @returns The metrics.
 */
function getMetrics(
  metricName: string,
  aggregation: AggregationType,
  crossSeriesAggregation: AggregationType,
  entityLabel?: string
): MetricType[] {
  return [
    {
      metric: metricName,
      aggregation: aggregation ?? 'MEAN',
      crossSeriesAggregation: crossSeriesAggregation,
      regex: false,
      label: entityLabel
    }
  ];
}
