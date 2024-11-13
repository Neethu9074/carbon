/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import ChartViewConfiguratorWithEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartViewConfiguratorWithEntitySelection';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/dialog/IncompleteChartPlaceholder';
import { toAlertConfig } from 'in-alerting/smart-alerts/applications/dialog/advanced/ThresholdSection';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';

import locals from 'in-alerting/smart-alerts/components/dialog/simple/SimpleAlertConfigDialogChart.mless';

export default function SimpleAlertConfigDialogChart({ form, onChartViewConfigChange, selectedChartViewConfigIndex }) {
  const alertConfigWithFormModel = toAlertConfig(form);
  const alertType = alertConfigWithFormModel.rule.alertType;
  const blueprintConfig = getBlueprintConfig(alertType);
  const isRuleComplete = blueprintConfig.isRuleComplete(alertConfigWithFormModel.rule);
  return (
    <ChartViewConfiguratorWithEntitySelection
      alertConfigWithFormModel={alertConfigWithFormModel}
      onChartViewConfigChange={onChartViewConfigChange}
      selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      className={locals.position}
      framed
    >
      {(chartViewConfig, applicationId, serviceId, endpointId) => (
        <>
          {isRuleComplete ? (
            <div className={locals.placeholder}>
              <ApplicationAlertingChartWithErrorMessage
                applicationId={applicationId}
                serviceId={serviceId}
                endpointId={endpointId}
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
    </ChartViewConfiguratorWithEntitySelection>
  );
}

SimpleAlertConfigDialogChart.propTypes = {
  form: PropTypes.object.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
