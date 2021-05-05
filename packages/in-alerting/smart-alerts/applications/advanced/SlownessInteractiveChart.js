/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  applicationsAlertingThresholdAggregationChanged,
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdTypeChanged,
  applicationsAlertingThresholdValueChanged
} from 'in-alerting/smart-alerts/applications/tracker';
import ApplicationAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/applications/chart/ApplicationAlertingChartWithErrorMessage';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdDeviationSliderForm';
import ChartViewConfiguratorWithEntitySelection from 'in-alerting/smart-alerts/applications/chart/ChartViewConfiguratorWithEntitySelection';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import { createSlownessForm, defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import ThresholdValueInput from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueInput';
import { findEntryByValue, alertConfigWithDefaultValues } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { PER_AP } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/form/ruleForm';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/applications/form/formUtils';
import createRuleForm from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/InteractiveChart.mless';

export default function SlownessInteractiveChart({
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
      <ThresholdCondition
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        blueprintConfig={blueprintConfig}
        editMode={editMode}
        isGlobalSmartAlert={isGlobalSmartAlert}
      />

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
    </div>
  );
}

function ThresholdCondition({ form, updateForm, onChange, blueprintConfig, editMode, isGlobalSmartAlert }) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);
  const canSelectBaseline = form.get('evaluationType').value === PER_AP && !isGlobalSmartAlert;

  return (
    <>
      <ThresholdConditionFormGroup>
        <Label>{blueprintConfig.getMetricLabel(metricName)}</Label>
        <Dropdown
          asSimpleDropdown
          label={getAggregationLabel(form)}
          items={getAggregationOptions(form)}
          onChange={({ value = '' }) => {
            updateForm(form.updateIn(['rule', 'aggregation'], f => f.setValue(value).setTouched(true)));

            applicationsAlertingThresholdAggregationChanged(getTrackingObject(form, { value }));
          }}
        />
        <ThresholdOperatorDropDown
          form={form}
          onChange={onChange}
          trackingCallback={applicationsAlertingThresholdOperatorChanged}
        />
        {canSelectBaseline ? (
          <>
            <Dropdown
              asSimpleDropdown
              label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
              items={thresholdTypeOptions}
              onChange={({ value = '' }) => {
                const valueParts = value.split('.');
                const thresholdType = valueParts[0];

                let newThresholdForm = createSlownessForm({
                  ...form.get('threshold').toJS(),
                  type: thresholdType
                });

                if (valueParts.length > 1) {
                  const seasonality = valueParts[1];
                  newThresholdForm = newThresholdForm.updateIn(['seasonality'], f =>
                    f.setValue(seasonality).setTouched()
                  );
                }

                const newRuleForm = createRuleForm({ ...form.get('rule').toJS() });

                updateForm(form.put('threshold', newThresholdForm).put('rule', newRuleForm));

                applicationsAlertingThresholdTypeChanged(getTrackingObject(form, { value: thresholdType }));
              }}
            />
            {thresholdType === 'historicBaseline' && (
              <RecalculateBaselineButton onChange={onChange} editMode={editMode} form={form} />
            )}
          </>
        ) : (
          <div>{t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')}</div>
        )}
      </ThresholdConditionFormGroup>

      {thresholdType === 'staticThreshold' && (
        <ThresholdConditionFormGroup iconType="lib_threshold" twoColumns hideLabel>
          <ThresholdValueInput
            max={maxValue}
            form={form}
            updateForm={updateForm}
            trackChange={applicationsAlertingThresholdValueChanged}
            metricUnitPostfix={metricUnitPostfix}
          />
          <UseSuggestedValueButton form={form} onChange={onChange} metricUnitPostfix={metricUnitPostfix} />
        </ThresholdConditionFormGroup>
      )}

      {thresholdType !== 'staticThreshold' && (
        <ThresholdDeviationSliderForm
          form={form}
          onChange={onChange}
          trackChange={applicationsAlertingThresholdTypeChanged}
          defaultValue={defaultDeviationFactor}
        />
      )}
    </>
  );
}

function getAggregationLabel(form) {
  const aggregationOptions = getAggregationOptions(form);
  let aggregationValue = form.get('rule').get('aggregation').value;
  const option = aggregationOptions.find(o => o.value === aggregationValue);
  return option?.label;
}

SlownessInteractiveChart.propTypes = {
  isGlobalSmartAlert: PropTypes.bool,
  blueprintConfig: blueprintConfigPropType.isRequired,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired,
  editMode: PropTypes.bool
};
