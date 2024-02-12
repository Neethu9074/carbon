/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { MobileAppAlertConfigWithMetadata } from '@instana/types';

import MobileAppAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/mobileApp/chart/MobileAppAlertingChartWithErrorMessage';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/dialog/IncompleteChartPlaceholder';
import { chartViewConfigs as defaultChartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogChart.mless';

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
  const alertType = (alertConfigWithFormModel as unknown as MobileAppAlertConfigWithMetadata).rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  const isRuleComplete = blueprintConfig.isRuleComplete(
    (alertConfigWithFormModel as unknown as MobileAppAlertConfigWithMetadata).rule
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
                alertConfigWithFormModel={
                  alertConfigWithFormModel as Omit<MobileAppAlertConfigWithMetadata, 'tagFilterExpression'> & {
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
  );
}
