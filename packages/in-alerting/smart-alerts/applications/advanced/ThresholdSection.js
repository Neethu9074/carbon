/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ChartViewConfiguratorWithEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartViewConfiguratorWithEntitySelection';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import IncompleteChartPlaceholder from 'in-alerting/smart-alerts/components/smart-alert-dialog/IncompleteChartPlaceholder';
import StatusCodeThresholdCondition from 'in-alerting/smart-alerts/applications/advanced/StatusCodeThresholdCondition';
import ThroughputThresholdCondition from 'in-alerting/smart-alerts/applications/advanced/ThroughputThresholdCondition';
import ErrorRateThresholdCondition from 'in-alerting/smart-alerts/applications/advanced/ErrorRateThresholdCondition';
import SlownessThresholdCondition from 'in-alerting/smart-alerts/applications/advanced/SlownessThresholdCondition';
import EntitySelectionFormUpdater from 'in-alerting/smart-alerts/applications/chart/EntitySelectionFormUpdater';
import LogsThresholdCondition from 'in-alerting/smart-alerts/applications/advanced/LogsThresholdCondition';
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
    alertConfigWithFormModel,
    ruleComplete,
    isGlobalSmartAlert,
    editMode
  } = props;

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
          headerTransparent
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
