/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import {
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdTypeChanged,
  applicationsAlertingThresholdDeviationFactorChanged,
  applicationsAlertingThresholdValueChanged
} from 'in-applications/alerting/tracker';
import { ThresholdDeviationSliderForm } from 'in-new-components/Alerting/advanced/ThresholdDeviationSliderForm';
import { findEntryByValue, alertConfigWithDefaultValues } from 'in-new-components/Alerting/utils/formUtils';
import { createThroughputForm, defaultDeviationFactor } from 'in-applications/alerting/form/thresholdForm';
import AlertingChartWithErrorMessage from 'in-new-components/Alerting/Chart/AlertingChartWithErrorMessage';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import { ThresholdOperatorDropDown } from 'in-new-components/Alerting/advanced/ThresholdOperatorDropDown';
import RecalculateBaselineButton from 'in-new-components/Alerting/advanced/RecalculateBaselineButton';
import { getThresholdComboBoxValue } from 'in-new-components/Alerting/advanced/thresholdFormHelper';
import UseSuggestedValueButton from 'in-new-components/Alerting/advanced/UseSuggestedValueButton';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { thresholdTypeOptions } from 'in-new-components/Alerting/advanced/thresholdFormData';
import ThresholdValueInput from 'in-new-components/Alerting/advanced/ThresholdValueInput';
import { blueprintConfigPropType } from 'in-new-components/Alerting/constants';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { getMetricUnitPostfix } from 'in-applications/alerting/form/formUtils';
import createRuleForm from 'in-applications/alerting/form/ruleForm';
import Dropdown from 'in-new-components/Alerting/Dropdown';
import Label from 'in-components/form/Label';

import locals from 'in-new-components/Alerting/shared-styles/InteractiveChart.mless';

export default function ThroughputInteractiveChart({
  blueprintConfig,
  form,
  onChange,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex,
  editMode
}) {
  const alertConfig = alertConfigWithDefaultValues(form);

  return (
    <div className={locals.container}>
      <ThresholdCondition
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        blueprintConfig={blueprintConfig}
        editMode={editMode}
      />

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

function ThresholdCondition({ form, updateForm, onChange, blueprintConfig, editMode }) {
  const thresholdType = form.get('threshold').get('type')?.value;
  const metricName = form.get('rule').get('metricName').value;
  const metricUnitPostfix = getMetricUnitPostfix(metricName);
  const maxValue = blueprintConfig.getMaxMetricValue(metricName);

  return (
    <>
      <ThresholdConditionFormGroup>
        <Label>{blueprintConfig.getMetricLabel(metricName)}</Label>
        <ThresholdOperatorDropDown
          form={form}
          customOnChange={newOperator => {
            let updatedForm = form.updateIn(['threshold', 'operator'], f => f.setValue(newOperator).setTouched(true));
            if (thresholdType === 'staticThreshold') {
              // if the operator direction changed in case of static-threshold: request new suggestion
              updatedForm = updatedForm.updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f =>
                f.setValue(true)
              );
            }
            updateForm(updatedForm);
          }}
          trackingCallback={applicationsAlertingThresholdOperatorChanged}
          allOptions
        />
        <Dropdown
          asSimpleDropdown
          label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
          items={thresholdTypeOptions}
          onChange={e => {
            const newThresholdTypeWithSeasonality = (e && e.value) || '';
            const valueParts = newThresholdTypeWithSeasonality.split('.');
            const newThresholdType = valueParts[0];

            let newThresholdForm = createThroughputForm({
              ...form.get('threshold').toJS(),
              type: newThresholdType,
              value: null, // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
              baseline: null
            });

            if (valueParts.length > 1) {
              const newSeasonality = valueParts[1];
              newThresholdForm = newThresholdForm.updateIn(['seasonality'], f =>
                f.setValue(newSeasonality).setTouched()
              );
            }

            const newRuleForm = createRuleForm({ ...form.get('rule').toJS(), aggregation: null }); // reset to default value (happens in createRuleForm)

            updateForm(
              form
                .put('threshold', newThresholdForm)
                .put('rule', newRuleForm)
                .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
            );

            applicationsAlertingThresholdTypeChanged(getTrackingObject(form, { value: newThresholdType }));
          }}
        />
        {thresholdType === 'historicBaseline' && <RecalculateBaselineButton onChange={onChange} editMode={editMode} />}
      </ThresholdConditionFormGroup>

      {thresholdType === 'staticThreshold' && (
        <ThresholdConditionFormGroup iconType="lib_threshold" label="Threshold Value">
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
          trackChange={applicationsAlertingThresholdDeviationFactorChanged}
          defaultValue={defaultDeviationFactor}
        />
      )}
    </>
  );
}

ThroughputInteractiveChart.propTypes = {
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired,
  editMode: PropTypes.bool
};
