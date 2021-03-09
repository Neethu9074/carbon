/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/chart/WebsitesAlertingChartWithErrorMessage';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/smart-alert-dialog/IncompleteChartPlaceholder';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';

import locals from 'in-alerting/smart-alerts/websites/simple/SimpleAlertConfigDialogChart.mless';

export default function SimpleAlertConfigDialogChart({ form, onChartViewConfigChange, selectedChartViewConfigIndex }) {
  const alertConfigWithFormModel = form.toJS();
  const alertType = alertConfigWithFormModel.rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  const isRuleComplete = blueprintConfig.isRuleComplete(alertConfigWithFormModel.rule);

  return (
    <ChartViewConfigurator
      alertConfigWithFormModel={alertConfigWithFormModel}
      onChartViewConfigChange={onChartViewConfigChange}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      className={locals.offset}
      framed
    >
      {chartViewConfig => (
        <>
          {isRuleComplete ? (
            <div className={locals.placeholder}>
              <WebsitesAlertingChartWithErrorMessage
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
