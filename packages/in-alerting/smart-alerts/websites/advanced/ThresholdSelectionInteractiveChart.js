/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import PropTypes from 'prop-types';
import React from 'react';

import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/chart/WebsitesAlertingChartWithErrorMessage';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/smart-alert-dialog/IncompleteChartPlaceholder';
import CustomEventsThresholdCondition from 'in-alerting/smart-alerts/websites/advanced/CustomEventsThresholdCondition';
import StatusCodeThresholdCondition from 'in-alerting/smart-alerts/websites/advanced/StatusCodeThresholdCondition';
import ThroughputThresholdCondition from 'in-alerting/smart-alerts/websites/advanced/ThroughputThresholdCondition';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator';
import JsErrorsThresholdCondition from 'in-alerting/smart-alerts/websites/advanced/JsErrorsThresholdCondition';
import SlownessThresholdCondition from 'in-alerting/smart-alerts/websites/advanced/SlownessThresholdCondition';
import { alertConfigWithDefaultThreshold } from 'in-alerting/smart-alerts/components/utils/formUtils';
import AlertTypeSwitch from 'in-alerting/smart-alerts/websites/components/AlertTypeSwitch';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import BorderedContainer from 'in-alerting/components/BorderedContainer';

export default function ThresholdSelectionInteractiveChart({
  alertType,
  blueprintConfig,
  form,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  editMode
}) {
  const alertConfigWithFormModel = alertConfigWithDefaultThreshold(form);

  if (!blueprintConfig.isRuleComplete(alertConfigWithFormModel.rule)) {
    return (
      <BorderedContainer>
        <IncompleteChartPlaceholder message={blueprintConfig.incompleteRuleMessage} />
      </BorderedContainer>
    );
  }

  return (
    <BorderedContainer>
      <AlertTypeSwitch
        alertType={alertType}
        renderJsErrors={() => (
          <JsErrorsThresholdCondition form={form} blueprintConfig={blueprintConfig} updateForm={updateForm} />
        )}
        renderCustomEvent={() => (
          <CustomEventsThresholdCondition
            form={form}
            blueprintConfig={blueprintConfig}
            updateForm={updateForm}
            editMode={editMode}
          />
        )}
        renderSlowness={() => (
          <SlownessThresholdCondition
            form={form}
            blueprintConfig={blueprintConfig}
            updateForm={updateForm}
            editMode={editMode}
          />
        )}
        renderStatusCode={() => (
          <StatusCodeThresholdCondition form={form} blueprintConfig={blueprintConfig} updateForm={updateForm} />
        )}
        renderThroughput={() => (
          <ThroughputThresholdCondition
            form={form}
            updateForm={updateForm}
            blueprintConfig={blueprintConfig}
            editMode={editMode}
          />
        )}
      />

      <ChartViewConfigurator
        alertConfigWithFormModel={alertConfigWithFormModel}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        headerTransparent
      >
        {chartViewConfig => (
          <WebsitesAlertingChartWithErrorMessage
            alertConfigWithFormModel={alertConfigWithFormModel}
            viewConfig={chartViewConfig}
            blueprintConfig={blueprintConfig}
            alertsPreviewEnabled
            canReload
          />
        )}
      </ChartViewConfigurator>
    </BorderedContainer>
  );
}

ThresholdSelectionInteractiveChart.propTypes = {
  alertType: PropTypes.string.isRequired,
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired,
  editMode: PropTypes.bool
};
