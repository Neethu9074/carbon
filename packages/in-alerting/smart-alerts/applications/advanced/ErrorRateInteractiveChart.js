/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import {
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdValueChanged
} from 'in-alerting/smart-alerts/applications/tracker';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import ThresholdValueInput from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueInput';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator';
import { alertConfigWithDefaultThreshold } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Label from 'in-components/form/Label';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/InteractiveChart.mless';

export default function ErrorRateInteractiveChart({
  blueprintConfig,
  form,
  onChange,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const alertConfigWithFormModel = alertConfigWithDefaultThreshold(form);
  return (
    <div className={locals.container}>
      <ThresholdCondition form={form} onChange={onChange} updateForm={updateForm} blueprintConfig={blueprintConfig} />

      <ChartViewConfigurator
        alertConfigWithFormModel={alertConfigWithFormModel}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        headerTransparent
      >
        {(chartViewConfig, serviceId) => (
          <ApplicationAlertingChartWithErrorMessage
            serviceId={serviceId}
            alertConfigWithFormModel={alertConfigWithFormModel}
            viewConfig={chartViewConfig}
            blueprintConfig={blueprintConfig}
            alertsPreviewEnabled
            canReload
          />
        )}
      </ChartViewConfigurator>
    </div>
  );
}

export function ThresholdCondition({ form, onChange, updateForm, blueprintConfig }) {
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <ThresholdConditionFormGroup>
      <Label id="errorRate" name="errorRate">
        {blueprintConfig.getMetricLabel(metricName)}
      </Label>
      <ThresholdOperatorDropDown
        form={form}
        onChange={onChange}
        trackingCallback={applicationsAlertingThresholdOperatorChanged}
      />
      <ThresholdValueInput
        className={locals.narrowControl}
        max={maxValue}
        form={form}
        updateForm={updateForm}
        trackChange={applicationsAlertingThresholdValueChanged}
        metricUnitPostfix={metricUnitPostfix}
        percentageMetric
      />
      <UseSuggestedValueButton form={form} onChange={onChange} metricUnitPostfix={metricUnitPostfix} percentageMetric />
    </ThresholdConditionFormGroup>
  );
}

ErrorRateInteractiveChart.propTypes = {
  form: PropTypes.object.isRequired,
  blueprintConfig: blueprintConfigPropType,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
