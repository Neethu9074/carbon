/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { AdaptiveBaselineData, HistoricBaselineData, Result, StaticThresholdData } from '@instana/types';
import { Stack } from '@instana/components';

import MobileAppAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/mobileApp/chart/MobileAppAlertingChartWithErrorMessage';
import HistoricBaselineErrorMessage from 'in-alerting/smart-alerts/components/dialog/HistoricBaselineErrorMessage';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/dialog/IncompleteChartPlaceholder';
import { MobileAppSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { chartViewConfigs as defaultChartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogChart.mless';

interface SimpleAlertConfigDialogChartProps {
  form: MapForm<any>;
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex?: number;
  thresholdResult: Result<StaticThresholdData | AdaptiveBaselineData | HistoricBaselineData> | undefined | null;
}

export default function SimpleAlertConfigDialogChart({
  form,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  thresholdResult
}: SimpleAlertConfigDialogChartProps) {
  const alertConfigWithFormModel = form.toJS();
  const alertType = (alertConfigWithFormModel as unknown as MobileAppSmartAlertConfigWithMetadata).rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  const isRuleComplete = blueprintConfig.isRuleComplete(
    (alertConfigWithFormModel as unknown as MobileAppSmartAlertConfigWithMetadata).rule
  );
  const chartViewConfigs = defaultChartViewConfigs;
  const thresholdType = form.get('threshold').get('type').value;

  return (
    <Stack>
      <ChartViewConfigurator
        onChartViewConfigChange={onChartViewConfigChange}
        chartViewConfigs={chartViewConfigs}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        className={locals.position}
        framed
      >
        {chartViewConfig => (
          <>
            {isRuleComplete ? (
              <div className={locals.placeholder}>
                <MobileAppAlertingChartWithErrorMessage
                  alertConfigWithFormModel={
                    alertConfigWithFormModel as Omit<MobileAppSmartAlertConfigWithMetadata, 'tagFilterExpression'> & {
                      tagFilterExpression: FormModelElement[];
                    }
                  }
                  viewConfig={chartViewConfig}
                  blueprintConfig={blueprintConfig}
                  eventBasedAdaptiveBaseline={[]}
                  canReload
                  alertsPreviewEnabled
                />
              </div>
            ) : (
              blueprintConfig?.incompleteRuleMessage && (
                <IncompleteChartPlaceholder message={blueprintConfig.incompleteRuleMessage} />
              )
            )}
          </>
        )}
      </ChartViewConfigurator>
      {thresholdType === HISTORIC_BASELINE && (
        <HistoricBaselineErrorMessage thresholdResult={thresholdResult as Result<HistoricBaselineData>} />
      )}
    </Stack>
  );
}
