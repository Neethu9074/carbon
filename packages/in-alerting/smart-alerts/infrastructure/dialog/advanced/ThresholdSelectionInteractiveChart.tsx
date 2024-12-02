/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useEffect, useMemo } from 'react';
import { MapForm } from 'formalistic';

import { InfraAlertRuleUnion, Order, TagCatalog } from '@instana/types';
import { RuleWithThreshold } from '@instana/types/typeDefinitions';
import { create } from '@instana/observables';

import InfraMultiThresholdCondition from 'in-alerting/smart-alerts/infrastructure/components/InfraMultiThresholdCondition';
import { getFormatter, getMetricUnitPostfix } from 'in-alerting/smart-alerts/infrastructure/details/AlertConfigHelper';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { chartViewConfigs as defaultChartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import { InfraMetricChart } from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricChart';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { chartTimeConfig } from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
import InfraMetricGroup from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricGroup';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import BorderedContainer from 'in-alerting/components/BorderedContainer';
import { toBackendGroupBy } from 'in-infrastructure/Explore/utils';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import { AggregationType } from 'in-types';
import { t } from 'in-i18n';

export const selectedMetricGroup$ = create().emit(null);

export interface ThresholdProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex?: number;
  tagCatalog: TagCatalog | undefined;
  regex: boolean;
}

export type Tags = { [index: string]: any };

export default function ThresholdSelectionInteractiveChart({
  form,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  tagCatalog,
  regex
}: ThresholdProps): JSX.Element {
  const chartViewConfigs = defaultChartViewConfigs;

  const groupBy = form.get('groupBy').value;

  const ruleForm = form.get('rule');
  const entityType = ruleForm.get('entityType').value;
  const metricName = ruleForm.get('metricName').value;
  const aggregation = ruleForm.get('aggregation').value;

  const crossSeriesAggregation = ruleForm.get('crossSeriesAggregation').value;

  const formatter = getFormatter(entityType, metricName);
  const percentageMetric = formatter === 'PERCENTAGE';
  const metricUnitPostfix = getMetricUnitPostfix(formatter);

  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);

  const backendGroupBy = toBackendGroupBy(groupBy) ?? [];
  const order = { by: backendGroupBy?.[0], direction: 'DESC' };
  const metrics = getMetrics(metricName, aggregation, crossSeriesAggregation, regex, metricLabel);

  const kpiDefinitions = getKpiDefinitions(entityType);
  const metricMetadatas = useMetricMetadatas({ type: entityType, queries: [metrics[0].metric], kpiDefinitions });

  const alertConfigModel = alertConfigWithDefaultThresholdAndTfe(form);

  // Since the timeConfig is part of the dependency array for the 'getGroups' API, memoised it to avoid the table refreshing frequently.
  const timeConfig = useMemo(() => {
    return chartTimeConfig;
  }, []);

  useEffect(() => {
    if (groupBy.length === 0) {
      selectedMetricGroup$.emit(null);
    }
  }, [groupBy]);

  return (
    <BorderedContainer>
      <InfraMultiThresholdCondition
        form={form}
        updateForm={updateForm}
        percentageMetric={percentageMetric}
        metricUnitPostfix={metricUnitPostfix}
        groupBy={groupBy}
      />
      <ChartViewConfigurator
        chartViewConfigs={chartViewConfigs}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        title={t('in-alerting:smartAlerts.infrastructure.alertDetails.alertConfigurationTitleTrigger')}
        doNotSetDefaultHeight
        framed
      >
        {chartViewConfig => (
          <>
            <InfraMetricChart
              alertConfig={alertConfigModel as InfraSmartAlertConfigWithMetadata}
              timeConfig={chartViewConfig.timeConfig}
              groupBy={groupBy}
              entityType={entityType}
              metricName={metricName}
              alertsPreviewEnabled
              metricLabel={metricLabel}
            />
            {groupBy.length > 0 && (
              <InfraMetricGroup
                backendQueryModel={alertConfigModel.tagFilterExpression}
                backendGroupBy={backendGroupBy}
                order={order as Order}
                type={entityType}
                metrics={metrics}
                groupBy={backendGroupBy}
                timeConfig={{
                  ...chartViewConfig.timeConfig,
                  to: timeConfig.to,
                  focusedMoment: timeConfig.focusedMoment
                }}
                metricMetadatas={metricMetadatas}
                tagCatalog={tagCatalog}
              />
            )}
          </>
        )}
      </ChartViewConfigurator>
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
 * @param regex Whether the metric name represents a regex for selecting metrics
 * @param entityLabel The entity label.
 * @returns The metrics.
 */
export function getMetrics(
  metricName: string,
  aggregation: AggregationType,
  crossSeriesAggregation: AggregationType,
  regex: boolean,
  entityLabel?: string
): MetricType[] {
  return [
    {
      metric: metricName,
      aggregation: aggregation ?? 'MEAN',
      crossSeriesAggregation: crossSeriesAggregation,
      regex,
      label: entityLabel
    }
  ];
}

export function alertConfigWithDefaultThresholdAndTfe(form: MapForm<any>) {
  const tagFilterExpression = form.get('tagFilterExpression').value;
  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');

  const ruleWithThreshold: RuleWithThreshold<InfraAlertRuleUnion> = {
    rule: form.get('rule').toJS(),
    thresholdOperator: form.get('threshold').get('operator').value,
    thresholds: { WARNING: warningThresholdField.toJS(), CRITICAL: criticalThresholdField.toJS() }
  };

  return {
    ...form.toJS(),
    rules: [ruleWithThreshold],
    tagFilterExpression: toBackendQueryModel(tagFilterExpression)
  };
}
