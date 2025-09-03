/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useMemo } from 'react';
import { MapForm } from 'formalistic';

import { getThresholdType } from 'in-alerting/smart-alerts/applications/dialog/advanced/StaticOrAdaptiveThresholdSwitch/StaticOrAdaptiveSwitch';
import {
  chartViewConfig6hours,
  chartViewConfigs as defaultChartViewConfigs
} from 'in-alerting/components/Chart/chartViewConfig';
import LogMultiThresholdCondition from 'in-alerting/smart-alerts/logs/components/LogMultiThresholdCondition';
import { alertConfigWithDefaultThresholdAndTfe } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { selectedMetricGroup$ } from 'in-alerting/smart-alerts/logs/details/AlertConfiguration';
import { LogMetricChart } from 'in-alerting/smart-alerts/logs/components/LogMetricChart';
import { chartTimeConfig } from 'in-alerting/smart-alerts/logs/components/LogChartUtils';
import LogMetricGroup from 'in-alerting/smart-alerts/logs/components/LogMetricGroup';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import BorderedContainer from 'in-alerting/components/BorderedContainer';
import { CatalogResponse } from 'in-logging/api/catalog';
import { t } from 'in-i18n';

export interface ThresholdProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex?: number;
  tagCatalog: CatalogResponse | undefined;
}

export default function ThresholdSelectionInteractiveChart({
  form,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  tagCatalog
}: ThresholdProps): JSX.Element {
  const thresholdType = getThresholdType(form);
  const chartViewConfigs = ADAPTIVE_BASELINE === thresholdType ? [chartViewConfig6hours] : defaultChartViewConfigs;
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
    <BorderedContainer>
      <LogMultiThresholdCondition
        form={form}
        updateForm={updateForm}
        percentageMetric={false}
        metricUnitPostfix={''}
        groupBy={groupBy}
      />
      <ChartViewConfigurator
        chartViewConfigs={chartViewConfigs}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        title={t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleTrigger')}
        doNotSetDefaultHeight
        framed
      >
        {chartViewConfig => (
          <>
            <LogMetricChart
              alertConfig={alertConfigModel as LogSmartAlertConfigWithMetadata}
              timeConfig={{
                ...chartViewConfig.timeConfig,
                to: timeConfig.to,
                focusedMoment: timeConfig.focusedMoment
              }}
              alertsPreviewEnabled
            />
            {groupBy && groupBy?.length > 0 && (
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
            )}
          </>
        )}
      </ChartViewConfigurator>
    </BorderedContainer>
  );
}
