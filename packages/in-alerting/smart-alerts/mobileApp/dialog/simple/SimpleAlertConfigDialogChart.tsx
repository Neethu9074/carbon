/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { MobileAppAlertConfig } from '@instana/types';

//@ts-expect-error TS migrate
import MobileAppAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/mobileApp/chart/MobileAppAlertingChartWithErrorMessage';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/dialog/IncompleteChartPlaceholder';
import { chartViewConfigs as defaultChartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogChart.mless';

interface AlertConfigWithFormModelProps extends Pick<MobileAppAlertConfig, 'rule'> {}

interface SimpleAlertConfigDialogChartProps {
  form: MapForm<any>;
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex?: number;
}
export default function SimpleAlertConfigDialogChart({
  form,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}: SimpleAlertConfigDialogChartProps) {
  const alertConfigWithFormModel = form.toJS();
  const alertType = (alertConfigWithFormModel as AlertConfigWithFormModelProps).rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  const isRuleComplete = blueprintConfig.isRuleComplete(
    (alertConfigWithFormModel as AlertConfigWithFormModelProps).rule
  );
  const chartViewConfigs = defaultChartViewConfigs;

  return (
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
                alertConfigWithFormModel={alertConfigWithFormModel}
                viewConfig={chartViewConfig}
                blueprintConfig={blueprintConfig}
                alertsPreviewEnabled
                canReload
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
  );
}
