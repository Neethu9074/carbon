import PropTypes from 'prop-types';
import React from 'react';

import {
  applicationsAlertingThresholdAggregationChanged,
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdTypeChanged,
  applicationsAlertingThresholdValueChanged
} from 'in-applications/alerting/tracker';
import {
  ruleAggregationForWeeklySeasonalityOptions,
  ruleAggregationOptions
} from 'in-applications/alerting/form/ruleFormData';
import {
  getFormValueOrDefault,
  getThresholdComboBoxValue
} from 'in-new-components/Alerting/advanced/thresholdFormHelper';
import { ThresholdDeviationSliderForm } from 'in-new-components/Alerting/advanced/ThresholdDeviationSliderForm';
import { findEntryByValue, alertConfigWithDefaultValues } from 'in-new-components/Alerting/utils/formUtils';
import AlertingChartWithErrorMessage from 'in-new-components/Alerting/Chart/AlertingChartWithErrorMessage';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-new-components/Alerting/advanced/ThresholdOperatorDropDown';
import { createSlownessForm, defaultDeviationFactor } from 'in-applications/alerting/form/thresholdForm';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { thresholdTypeOptions } from 'in-new-components/Alerting/advanced/thresholdFormData';
import ThresholdValueInput from 'in-new-components/Alerting/advanced/ThresholdValueInput';
import { blueprintConfigPropType } from 'in-new-components/Alerting/constants';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { getMetricUnitPostfix } from 'in-applications/alerting/form/formUtils';
import createRuleForm from 'in-applications/alerting/form/ruleForm';
import Dropdown from 'in-new-components/Alerting/Dropdown';
import { isNotBlank } from 'in-services/util/string';
import Label from 'in-components/form/Label';

import locals from 'in-new-components/Alerting/shared-styles/InteractiveChart.mless';

export default function SlownessInteractiveChart({
  blueprintConfig,
  form,
  onChange,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const alertConfig = alertConfigWithDefaultValues(form);

  return (
    <div className={locals.container}>
      <ThresholdCondition form={form} updateForm={updateForm} onChange={onChange} blueprintConfig={blueprintConfig} />

      <ChartViewConfigurator
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        className={locals.chartContainer}
        headerTransparent
      >
        {chartViewConfig => (
          <AlertingChartWithErrorMessage
            alertConfig={alertConfig}
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

function ThresholdCondition({ form, updateForm, onChange, blueprintConfig }) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricName = form.get('rule').get('metricName').value;
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
            const thresholdType = form.get('threshold').get('type').value;
            updateForm(
              form
                .updateIn(['rule', 'aggregation'], f => f.setValue(value).setTouched(true))
                .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                // reset "old" threshold/baseline-value to ensure that we don't call endpoints with the previous values
                .updateIn(['threshold', thresholdType === 'historicBaseline' ? 'baseline' : 'value'], f =>
                  f.setValue(null).setTouched(true)
                )
            );

            applicationsAlertingThresholdAggregationChanged(getTrackingObject(form, { value }));
          }}
        />
        <ThresholdOperatorDropDown
          form={form}
          onChange={onChange}
          trackingCallback={applicationsAlertingThresholdOperatorChanged}
        />
        <Dropdown
          asSimpleDropdown
          label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
          items={thresholdTypeOptions}
          onChange={({ value = '' }) => {
            const valueParts = value.split('.');
            const thresholdType = valueParts[0];

            let newThresholdForm = createSlownessForm({
              ...form.get('threshold').toJS(),
              type: thresholdType,
              value: null, // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
              baseline: null
            });

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

            applicationsAlertingThresholdTypeChanged(getTrackingObject(form, { value: thresholdType }));
          }}
        />
      </ThresholdConditionFormGroup>

      {thresholdType === 'staticThreshold' && (
        <ThresholdConditionFormGroup iconType="lib_threshold" label="Threshold Value">
          <ThresholdValueInput
            max={maxValue}
            form={form}
            onChange={onChange}
            trackChange={applicationsAlertingThresholdValueChanged}
          />
          {isNotBlank(metricUnitPostfix) && <Label htmlFor="thresholdValue">{metricUnitPostfix}</Label>}
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

function getAggregationLabelAndUpdateFormIfNeeded(form, updateForm) {
  const aggregationOptions = getAggregationOptions(form);
  let aggregationValue = form.get('rule').get('aggregation').value;
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
  blueprintConfig: blueprintConfigPropType.isRequired,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
