/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import ChartViewConfiguratorWithEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartViewConfiguratorWithEntitySelection';
import ThroughputThresholdCondition from 'in-alerting/smart-alerts/applications/advanced/ThroughputThresholdCondition';
import EntitySelectionFormUpdater from 'in-alerting/smart-alerts/applications/chart/EntitySelectionFormUpdater';
import { alertConfigWithDefaultValues } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { blueprintConfigPropType } from 'in-alerting/components/constants';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/InteractiveChart.mless';

export default function ThroughputInteractiveChart({
  blueprintConfig,
  form,
  onChange,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  isGlobalSmartAlert,
  editMode
}) {
  const alertConfigWithFormModel = alertConfigWithDefaultValues(form);

  return (
    <div className={locals.container}>
      <ThroughputThresholdCondition
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        blueprintConfig={blueprintConfig}
        editMode={editMode}
        isGlobalSmartAlert={isGlobalSmartAlert}
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
              useApproximateQueryPrecisionForMetrics
            />
          )}
        </ChartViewConfiguratorWithEntitySelection>
      </EntitySelectionFormUpdater>
    </div>
  );
}

ThroughputInteractiveChart.propTypes = {
  isGlobalSmartAlert: PropTypes.bool,
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired,
  editMode: PropTypes.bool
};
