/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useMemo } from 'react';
import { MapForm } from 'formalistic';

import { CarbonLayer, Spacer, Stack, StackItem } from '@instana/components';
import { ButtonGroup } from '@instana/components';
import { create } from '@instana/observables';
import { Order } from '@instana/types';

import {
  alertConfigWithDefaultThresholdAndTfe,
  getMetrics
} from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import {
  ChartViewConfigItem,
  chartViewConfigs as defaultChartViewConfigs
} from 'in-alerting/components/Chart/chartViewConfig';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { useGetMetricLabel } from 'in-alerting/smart-alerts/infrastructure/components/InfraAlertChartWrapper';
import { InfraMetricChart } from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricChart';
import { chartTimeConfig } from 'in-alerting/smart-alerts/infrastructure/components/InfraChartUtils';
import InfraMetricGroup from 'in-alerting/smart-alerts/infrastructure/components/InfraMetricGroup';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import BorderedContainer from 'in-alerting/components/BorderedContainer';
import { toBackendGroupBy } from 'in-infrastructure/Explore/utils';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import { t } from 'in-i18n';

import locals from './ThresholdChart.mless';

export const selectedMetricGroup$ = create().emit(null);

interface ThresholdChartProps {
  form: MapForm<any>;
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex?: number;
}

export function ThresholdChart({ form, onChartViewConfigChange, selectedChartViewConfigIndex }: ThresholdChartProps) {
  const chartViewConfigs = defaultChartViewConfigs;
  const groupBy = form.get('groupBy').value;
  const metric = form.get('rule')?.get('metricName')?.value;
  const regex = form.get('rule').get('regex')?.value;

  const ruleForm = form.get('rule');
  const entityType = ruleForm.get('entityType').value;
  const metricName = ruleForm.get('metricName').value;
  const aggregation = ruleForm.get('aggregation').value;

  const crossSeriesAggregation = ruleForm.get('crossSeriesAggregation').value;

  const metricLabel = useGetMetricLabel(entityType, metricName, aggregation);

  const backendGroupBy = toBackendGroupBy(groupBy) ?? [];
  const order = { by: backendGroupBy?.[0], direction: 'DESC' };
  const metrics = getMetrics(metricName, aggregation, crossSeriesAggregation, regex, metricLabel);

  const kpiDefinitions = getKpiDefinitions(entityType);
  const metricMetadatas = useMetricMetadatas({ type: entityType, queries: [metrics[0].metric], kpiDefinitions });

  const alertConfigModel = alertConfigWithDefaultThresholdAndTfe(form);

  const tagCatalog = useTagCatalog({ ownerType: entityType, metric, regex });

  const timeConfig = useMemo(() => {
    return chartTimeConfig;
  }, []);

  useEffect(() => {
    if (groupBy.length === 0) {
      selectedMetricGroup$.emit(null);
    }
  }, [groupBy]);
  return (
    <Stack>
      <Spacer size="gutter" />
      <InfraChartConfigurator
        chartViewConfigs={chartViewConfigs}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex ?? 0}
      >
        {(chartViewConfig: ChartViewConfigItem) => (
          <>
            <div className={locals.whiteBackground}>
              <BorderedContainer>
                <div className={locals.chartPadding}>
                  <InfraMetricChart
                    alertConfig={alertConfigModel as InfraSmartAlertConfigWithMetadata}
                    timeConfig={chartViewConfig.timeConfig}
                    groupBy={groupBy}
                    entityType={entityType}
                    metricName={metricName}
                    alertsPreviewEnabled
                    metricLabel={metricLabel}
                  />
                </div>
              </BorderedContainer>
            </div>
            {groupBy.length > 0 && (
              <>
                <Spacer size="small" />
                <CarbonLayer>
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
                </CarbonLayer>
              </>
            )}
          </>
        )}
      </InfraChartConfigurator>
    </Stack>
  );
}

interface InfraChartConfiguratorProps {
  chartViewConfigs: readonly ChartViewConfigItem[];
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex: number;
  children: (chartViewConfig: ChartViewConfigItem) => JSX.Element;
}

function InfraChartConfigurator({
  chartViewConfigs,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  children
}: InfraChartConfiguratorProps) {
  const selectedChartViewConfig = chartViewConfigs[selectedChartViewConfigIndex];
  return (
    <Stack gap="disabled">
      <Stack direction="horizontal" gap="normal" align="center">
        <TearSheetStepTitleWrapper
          headline={t('in-alerting:smartAlerts.infrastructure.tearSheet.chartAlertPreview')}
          description={t('in-alerting:smartAlerts.infrastructure.tearSheet.chartAlertPreviewDescription')}
        >
          <></>
        </TearSheetStepTitleWrapper>
        <ButtonGroup
          buttonPropsList={chartViewConfigs.map((chartConfig: ChartViewConfigItem, index: number) => ({
            text: chartConfig.label,
            key: chartConfig.label,
            onClick: () => (onChartViewConfigChange ? onChartViewConfigChange(index) : undefined)
          }))}
          activeKey={selectedChartViewConfig?.label}
        />
      </Stack>
      <StackItem>{children(selectedChartViewConfig)}</StackItem>
    </Stack>
  );
}
