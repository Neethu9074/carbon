/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import {
  websitesAlertingAggregationChanged,
  websitesAlertingThresholdDeviationFactorChanged,
  websitesAlertingThresholdOperatorChanged,
  websitesAlertingThresholdTypeChanged,
  websitesAlertingThresholdValueChanged
} from 'in-alerting/smart-alerts/websites/tracker';
import {
  getFormValueOrDefault,
  getThresholdComboBoxValue
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormHelper';
import {
  ruleAggregationForWeeklySeasonalityOptions,
  ruleAggregationOptions
} from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { ThresholdDeviationSliderForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdDeviationSliderForm';
import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdOperatorDropDown';
import WebsitesAlertingChartWithErrorMessage from 'in-alerting/smart-alerts/websites/chart/WebsitesAlertingChartWithErrorMessage';
import RecalculateBaselineButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/RecalculateBaselineButton';
import UseSuggestedValueButton from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/UseSuggestedValueButton';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import ThresholdValueInput from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdValueInput';
import createThresholdForm, { defaultDeviationFactor } from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import { findEntryByValue, alertConfigWithDefaultValues } from 'in-alerting/smart-alerts/components/utils/formUtils';
import ChartViewConfigurator from 'in-alerting/smart-alerts/components/smart-alert-dialog/ChartViewConfigurator';
import { getTrackingObject } from 'in-alerting/smart-alerts/components/smart-alert-dialog/trackingHelpers';
import { getMetricUnitPostfix } from 'in-alerting/smart-alerts/websites/form/formUtils';
import createRuleForm from 'in-alerting/smart-alerts/websites/form/ruleForm';
import { blueprintConfigPropType } from 'in-alerting/components/constants';
import Dropdown from 'in-alerting/components/Dropdown';
import Label from 'in-components/form/Label';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles//InteractiveChart.mless';

export default function SlownessInteractiveChart({
  blueprintConfig,
  form,
  onChange,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  editMode
}) {
  const alertConfigWithFormModel = alertConfigWithDefaultValues(form);

  return (
    <div className={locals.container}>
      <ThresholdCondition
        form={form}
        blueprintConfig={blueprintConfig}
        updateForm={updateForm}
        onChange={onChange}
        editMode={editMode}
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
    </div>
  );
}

export function ThresholdCondition({ form, updateForm, onChange, blueprintConfig, editMode }) {
  const metricName = form.get('rule').get('metricName').value;
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);

  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <>
      <ThresholdConditionFormGroup>
        <Label>{blueprintConfig.getMetricLabel(metricName)}</Label>
        <Dropdown
          asSimpleDropdown
          label={getAggregationLabelAndUpdateFormIfNeeded(form, updateForm)}
          items={getAggregationOptions(form)}
          onChange={({ value = '' }) => {
            updateForm(
              form
                .updateIn(['rule', 'aggregation'], f => f.setValue(value).setTouched(true))
                .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                // reset "old" threshold/baseline-value to ensure that we don't call endpoints with the previous values
                .updateIn(['threshold', thresholdType === 'historicBaseline' ? 'baseline' : 'value'], f =>
                  f.setValue(null).setTouched(true)
                )
            );
            websitesAlertingAggregationChanged(getTrackingObject(form, { value }));
          }}
        />
        <ThresholdOperatorDropDown
          form={form}
          onChange={onChange}
          trackingCallback={websitesAlertingThresholdOperatorChanged}
        />
        <Dropdown
          asSimpleDropdown
          label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
          items={thresholdTypeOptions}
          onChange={e => {
            const value = e?.value ?? '';
            const valueParts = value.split('.');
            const thresholdType = valueParts[0];

            let newThresholdForm = createThresholdForm(
              {
                ...form.get('threshold').toJS(),
                type: thresholdType
              },
              form.get('rule').get('alertType').value
            );

            if (valueParts.length > 1) {
              const seasonality = valueParts[1];
              newThresholdForm = newThresholdForm.updateIn(['seasonality'], f => f.setValue(seasonality).setTouched());
            }

            const newRuleForm = createRuleForm({ ...form.get('rule').toJS() });

            updateForm(
              form
                .put('threshold', newThresholdForm)
                .put('rule', newRuleForm)
                .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
            );

            websitesAlertingThresholdTypeChanged(getTrackingObject(form, { value: thresholdType }));
          }}
        />
      </ThresholdConditionFormGroup>

      {thresholdType === 'staticThreshold' && (
        <ThresholdConditionFormGroup iconType="lib_threshold" label="Threshold Value">
          <ThresholdValueInput
            max={maxValue}
            form={form}
            updateForm={updateForm}
            trackChange={websitesAlertingThresholdValueChanged}
            metricUnitPostfix={metricUnitPostfix}
          />
          <UseSuggestedValueButton form={form} onChange={onChange} metricUnitPostfix={metricUnitPostfix} />
        </ThresholdConditionFormGroup>
      )}

      {thresholdType !== 'staticThreshold' && (
        <ThresholdDeviationSliderForm
          form={form}
          onChange={onChange}
          trackChange={websitesAlertingThresholdDeviationFactorChanged}
          defaultValue={defaultDeviationFactor}
        />
      )}
      {thresholdType === 'historicBaseline' && <RecalculateBaselineButton onChange={onChange} editMode={editMode} />}
    </>
  );
}

function getAggregationLabelAndUpdateFormIfNeeded(form, updateForm) {
  const aggregationOptions = getAggregationOptions(form);
  let aggregationValue = form.get('rule').get('aggregation')?.value;
  let option = aggregationOptions.find(o => o.value === aggregationValue);
  if (!option) {
    aggregationValue = aggregationOptions[0].value;
    updateForm(
      form
        .updateIn(['rule', 'aggregation'], f => f.setValue(aggregationValue).setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
    option = aggregationOptions[0];
  }
  return option.label;
}

function getAggregationOptions(form) {
  if (getFormValueOrDefault(form.get('threshold'), 'seasonality') === 'WEEKLY') {
    return ruleAggregationForWeeklySeasonalityOptions;
  }
  return ruleAggregationOptions;
}

SlownessInteractiveChart.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired,
  editMode: PropTypes.bool
};
