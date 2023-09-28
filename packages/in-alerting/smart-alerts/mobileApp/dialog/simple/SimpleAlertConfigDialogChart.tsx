/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import PropTypes from 'prop-types';
import React from 'react';

import MobileAppAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/mobileApp/chart/MobileAppAlertingChartWithErrorMessage';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/dialog/IncompleteChartPlaceholder';
import { chartViewConfigs as defaultChartViewConfigs } from 'in-alerting/components/Chart/chartViewConfig';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/dialog/ChartViewConfigurator';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogChart.mless';

export default function SimpleAlertConfigDialogChart({ form, onChartViewConfigChange, selectedChartViewConfigIndex }) {
  const alertConfigWithFormModel = form.toJS();
  const alertType = alertConfigWithFormModel.rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  const isRuleComplete = blueprintConfig.isRuleComplete(alertConfigWithFormModel.rule);
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
            <IncompleteChartPlaceholder message={blueprintConfig.incompleteRuleMessage} />
          )}
        </>
      )}
    </ChartViewConfigurator>
  );
}

SimpleAlertConfigDialogChart.propTypes = {
  form: PropTypes.object.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
