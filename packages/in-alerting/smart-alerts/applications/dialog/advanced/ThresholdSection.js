/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ChartViewConfiguratorWithEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartViewConfiguratorWithEntitySelection';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import StatusCodeThresholdCondition from 'in-alerting/smart-alerts/applications/dialog/advanced/StatusCodeThresholdCondition';
import ThroughputThresholdCondition from 'in-alerting/smart-alerts/applications/dialog/advanced/ThroughputThresholdCondition';
import ErrorRateThresholdCondition from 'in-alerting/smart-alerts/applications/dialog/advanced/ErrorRateThresholdCondition';
import SlownessThresholdCondition from 'in-alerting/smart-alerts/applications/dialog/advanced/SlownessThresholdCondition';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import LogsThresholdCondition from 'in-alerting/smart-alerts/applications/dialog/advanced/LogsThresholdCondition';
import EntitySelectionFormUpdater from 'in-alerting/smart-alerts/applications/chart/EntitySelectionFormUpdater';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/dialog/IncompleteChartPlaceholder';
import { WARNING_SEVERITY, CRITICAL_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import AlertTypeSwitch from 'in-alerting/smart-alerts/applications/components/AlertTypeSwitch';
import BorderedContainer from 'in-alerting/components/BorderedContainer';

export function ThresholdSection(props) {
  const {
    alertType,
    blueprintConfig,
    form,
    updateForm,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    ruleComplete,
    isGlobalSmartAlert,
    editMode
  } = props;

  const alertConfigWithFormModel = blueprintConfig.enrichWithDefaultThresholdValues(toAlertConfig(form));

  if (!ruleComplete) {
    return (
      <BorderedContainer>
        <IncompleteChartPlaceholder message={blueprintConfig.incompleteRuleMessage} />;
      </BorderedContainer>
    );
  }

  return (
    <BorderedContainer>
      <AlertTypeSwitch
        isGlobalSmartAlert={isGlobalSmartAlert}
        alertType={alertType}
        blueprintConfig={blueprintConfig}
        editMode={editMode}
        form={form}
        updateForm={updateForm}
        renderErrorRate={props => <ErrorRateThresholdCondition {...props} />}
        renderSlowness={props => <SlownessThresholdCondition {...props} />}
        renderLogs={props => <LogsThresholdCondition {...props} />}
        renderStatusCode={props => <StatusCodeThresholdCondition {...props} />}
        renderThroughput={props => <ThroughputThresholdCondition {...props} />}
      />

      <EntitySelectionFormUpdater form={form} updateForm={updateForm} isGlobalSmartAlert={isGlobalSmartAlert}>
        <ChartViewConfiguratorWithEntitySelection
          alertConfigWithFormModel={alertConfigWithFormModel}
          onChartViewConfigChange={onChartViewConfigChange}
          selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        >
          {(chartViewConfig, applicationId, serviceId, endpointId) => (
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
          )}
        </ChartViewConfiguratorWithEntitySelection>
      </EntitySelectionFormUpdater>
    </BorderedContainer>
  );
}

export function toAlertConfig(form) {
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const ruleWithThreshold = getRuleWithThreshold(form);
  const baseline = thresholdType === ADAPTIVE_BASELINE ? form.get('threshold').get('baseline')?.value : [];

  let alertConfig = form.remove('threshold').toJS();
  alertConfig.rules = [ruleWithThreshold];

  // For AdaptiveThreshold, there is no baseline field within warningThreshold/criticalThreshold in thresholdForm.
  // To maintain consistency with other threshold types, we add the baseline field to warningThreshold/criticalThreshold
  // before passing alertConfigWithFormModel to ApplicationAlertingChartWithErrorMessage.
  // This ensures the handling of thresholds is generic across different threshold types.
  if (thresholdType === ADAPTIVE_BASELINE && baseline) {
    if (alertConfig.rules[0].thresholds.WARNING) {
      alertConfig.rules[0].thresholds.WARNING.baseline = baseline;
    }
    if (alertConfig.rules[0].thresholds.CRITICAL) {
      alertConfig.rules[0].thresholds.CRITICAL.baseline = baseline;
    }
  }

  return alertConfig;
}

function getRuleWithThreshold(form) {
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;

  const warningThresholdField = form.get('threshold').get('warningThreshold');
  const criticalThresholdField = form.get('threshold').get('criticalThreshold');

  const warningThreshold = getThresholdData(thresholdType, warningThresholdField, WARNING_SEVERITY);
  const criticalThreshold = getThresholdData(thresholdType, criticalThresholdField, CRITICAL_SEVERITY);

  const ruleWithThreshold = {
    rule: form.get('rule').toJS(),
    thresholdOperator: form.get('threshold').get('operator').value,
    thresholds: { ...warningThreshold, ...criticalThreshold }
  };

  return ruleWithThreshold;
}

export function getThresholdData(thresholdType, thresholdField, severity) {
  if (
    thresholdType === HISTORIC_BASELINE ||
    thresholdType === ADAPTIVE_BASELINE ||
    thresholdType === STATIC_THRESHOLD
  ) {
    return thresholdField.get('isCheckboxSelected').value ? { [severity]: thresholdField.toJS() } : { [severity]: {} };
  }

  return {};
}
