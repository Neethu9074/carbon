/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useMemo } from 'react';
import { MapForm } from 'formalistic';

import { CarbonLayer, Spacer, Stack, StackItem, ButtonGroup } from '@instana/components';
import { create } from '@instana/observables';

import {
  ChartViewConfigItem,
  chartViewConfigs as defaultChartViewConfigs
} from 'in-alerting/components/Chart/chartViewConfig';
import { alertConfigWithDefaultThresholdAndTfe } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { LogMetricChart } from 'in-alerting/smart-alerts/logs/components/LogMetricChart';
import { chartTimeConfig } from 'in-alerting/smart-alerts/logs/components/LogChartUtils';
import LogMetricGroup from 'in-alerting/smart-alerts/logs/components/LogMetricGroup';
import BorderedContainer from 'in-alerting/components/BorderedContainer';
import useTagCatalog from 'in-logging/hooks/useTagCatalog';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/logs/tearsheet/components/ThresholdChart.mless';

export const selectedMetricGroup$ = create().emit(null);

interface ThresholdChartProps {
  form: MapForm<any>;
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex?: number;
}

export function ThresholdChart({ form, onChartViewConfigChange, selectedChartViewConfigIndex }: ThresholdChartProps) {
  const tagCatalog = useTagCatalog('SMART_ALERTS');
  const chartViewConfigs = defaultChartViewConfigs;
  const groupByTag = form.get('groupBy').value;

  const groupBy = useMemo(() => {
    return groupByTag ? [groupByTag] : [];
  }, [groupByTag]);

  useEffect(() => {
    if (!groupBy || groupBy.length === 0) {
      selectedMetricGroup$.emit(null);
    }
  }, [groupBy]);

  const alertConfigModel = alertConfigWithDefaultThresholdAndTfe(form);

  // Since the timeConfig is part of the dependency array for the 'getGroups' API, memoised it to avoid the table refreshing frequently.
  const timeConfig = useMemo(() => {
    return chartTimeConfig;
  }, []);

  return (
    <Stack>
      <Spacer size="gutter" />
      <LogChartConfigurator
        chartViewConfigs={chartViewConfigs}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex ?? 0}
      >
        {(chartViewConfig: ChartViewConfigItem) => (
          <>
            <div className={locals.whiteBackground}>
              <BorderedContainer>
                <div className={locals.chartPadding}>
                  <LogMetricChart
                    alertConfig={alertConfigModel as LogSmartAlertConfigWithMetadata}
                    timeConfig={{
                      ...chartViewConfig.timeConfig,
                      to: timeConfig.to,
                      focusedMoment: timeConfig.focusedMoment
                    }}
                  />
                </div>
              </BorderedContainer>
            </div>
            {groupBy && groupBy?.length > 0 && (
              <>
                <Spacer size="small" />
                <CarbonLayer>
                  <LogMetricGroup
                    backendQueryModel={alertConfigModel.tagFilterExpression}
                    groupBy={groupBy}
                    timeConfig={{
                      ...chartViewConfig.timeConfig,
                      to: timeConfig.to,
                      focusedMoment: timeConfig.focusedMoment
                    }}
                    tagCatalog={tagCatalog}
                  />
                </CarbonLayer>
              </>
            )}
          </>
        )}
      </LogChartConfigurator>
    </Stack>
  );
}

interface LogChartConfiguratorProps {
  chartViewConfigs: readonly ChartViewConfigItem[];
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex: number;
  children: (chartViewConfig: ChartViewConfigItem) => JSX.Element;
}

function LogChartConfigurator({
  chartViewConfigs,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  children
}: LogChartConfiguratorProps) {
  const selectedChartViewConfig = chartViewConfigs[selectedChartViewConfigIndex];
  return (
    <Stack gap="disabled">
      <Stack direction="horizontal" align="center">
        <TearSheetStepTitleWrapper
          headline={t('in-alerting:smartAlerts.logs.tearSheet.chartAlertPreview')}
          description={t('in-alerting:smartAlerts.logs.tearSheet.chartAlertPreviewDescription')}
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
