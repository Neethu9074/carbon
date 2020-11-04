import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  debouncedThresholdValueChangedTracker,
  debouncedThresholdDeviationFactorChangedTracker
} from 'in-applications/alerting/trackingHelpers';
import {
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdTypeChanged
} from 'in-applications/alerting/tracker';
import { thresholdTypeOptions, thresholdOperatorOptions } from 'in-new-components/Alerting/advanced/thresholdFormData';
import { createThroughputForm, defaultDeviationFactor } from 'in-applications/alerting/form/thresholdForm';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { isDifferentOperatorDirection } from 'in-new-components/Alerting/utils/alertUtils';
import { SensitivitySlider } from 'in-new-components/Alerting/advanced/SensitivitySlider';
import useDebouncedSignal from 'in-applications/alerting/advanced/useDebouncedSignal';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { blueprintConfigPropType } from 'in-new-components/Alerting/constants';
import { getMetricUnitPostfix } from 'in-applications/alerting/form/formUtils';
import { findEntryByValue } from 'in-new-components/Alerting/utils/formUtils';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
import createRuleForm from 'in-applications/alerting/form/ruleForm';
import Dropdown from 'in-new-components/Alerting/Dropdown';
import { isNotBlank } from 'in-services/util/string';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import locals from 'in-new-components/Alerting/shared-styles/InteractiveChart.mless';

export default function ThroughputInteractiveChart({
  blueprintConfig,
  form,
  onChange,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
  const debounceOnChange$ = useDebouncedSignal();
  const [tempThreshold, setTempThreshold] = useState(() => getFormValueOrDefault(form.get('threshold'), 'value'));
  const [tempThresholdDeviationFactor, setTempThresholdDeviationFactor] = useState(() =>
    getFormValueOrDefault(form.get('threshold'), 'deviationFactor')
  );
  const [doDebounceThreshold, setDoDebounceThreshold] = useState(false);
  const [doDebounceDeviationFactor, setDoDebounceDeviationFactor] = useState(false);

  const alertConfig = {
    ...form.toJS(),
    threshold: {
      ...form.get('threshold').toJS(),
      value: (doDebounceThreshold ? tempThreshold : getFormValueOrDefault(form.get('threshold'), 'value')) || 0,
      baseline: getFormValueOrDefault(form.get('threshold'), 'baseline') || [],
      deviationFactor: Number(
        doDebounceDeviationFactor
          ? tempThresholdDeviationFactor
          : getFormValueOrDefault(form.get('threshold'), 'deviationFactor', 0)
      )
    }
  };

  return (
    <div className={locals.container}>
      <ThresholdCondition
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        blueprintConfig={blueprintConfig}
        debounceOnChange$={debounceOnChange$}
        doDebounceThreshold={doDebounceThreshold}
        doDebounceDeviationFactor={doDebounceDeviationFactor}
        setDoDebounceThreshold={setDoDebounceThreshold}
        setDoDebounceDeviationFactor={setDoDebounceDeviationFactor}
        tempThreshold={tempThreshold}
        setTempThreshold={setTempThreshold}
        tempThresholdDeviationFactor={tempThresholdDeviationFactor}
        setTempThresholdDeviationFactor={setTempThresholdDeviationFactor}
      />

      <ChartViewConfigurator
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
        className={locals.chartContainer}
        headerTransparent
      >
        {chartViewConfig => (
          <AlertingChart
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

function ThresholdCondition({
  form,
  updateForm,
  onChange,
  blueprintConfig,
  debounceOnChange$,
  doDebounceThreshold,
  doDebounceDeviationFactor,
  setDoDebounceThreshold,
  setDoDebounceDeviationFactor,
  tempThreshold,
  setTempThreshold,
  tempThresholdDeviationFactor,
  setTempThresholdDeviationFactor
}) {
  const operatorValue = form.get('threshold').get('operator').value;
  const operatorLabel = thresholdOperatorOptions.find(op => op.value === operatorValue).label;

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
          name="thresholdOperator"
          label={operatorLabel}
          items={thresholdOperatorOptions}
          onChange={e => {
            const newOperator = (e && e.value) || '';

            let updatedForm = form.updateIn(['threshold', 'operator'], f => f.setValue(newOperator).setTouched(true));
            if (thresholdType === 'staticThreshold' && isDifferentOperatorDirection(newOperator, operatorValue)) {
              // if the operator direction changed in case of static-threshold: request new suggestion
              updatedForm = updatedForm.updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f =>
                f.setValue(true)
              );
            }
            updateForm(updatedForm);

            applicationsAlertingThresholdOperatorChanged(getTrackingObject(form, { value: newOperator }));
          }}
        />
        <Dropdown
          asSimpleDropdown
          name="thresholdType"
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
          defaultValue="staticThreshold"
        />
      </ThresholdConditionFormGroup>
      {thresholdType === 'staticThreshold' && (
        <ThresholdConditionFormGroup iconType="lib_threshold" label="Threshold Value">
          <Input
            id="thresholdValue"
            type="number"
            min="0"
            max={maxValue}
            name="thresholdValue"
            value={doDebounceThreshold ? tempThreshold : getFormValueOrDefault(form.get('threshold'), 'value')}
            step="1"
            onChange={e => {
              if (e.target.value > maxValue) return;
              const newThresholdValue = e.target.value !== '' ? Math.abs(e.target.value) : '';

              setDoDebounceThreshold(true);
              setTempThreshold(newThresholdValue);

              const onChangCallback = () => {
                onChange(['threshold', 'value'], f => f.setValue(newThresholdValue).setTouched(true));
                setDoDebounceThreshold(false);
              };

              debounceOnChange$.emit(onChangCallback.bind(this));
              debouncedThresholdValueChangedTracker(getTrackingObject(form, { value: newThresholdValue }));
            }}
          />
          {isNotBlank(metricUnitPostfix) && <Label htmlFor="thresholdValue">{metricUnitPostfix}</Label>}
        </ThresholdConditionFormGroup>
      )}

      {thresholdType !== 'staticThreshold' && (
        <ThresholdConditionFormGroup iconType="lib_threshold" label="Sensitivity">
          <SensitivitySlider
            value={
              doDebounceDeviationFactor
                ? tempThresholdDeviationFactor
                : getFormValueOrDefault(form.get('threshold'), 'deviationFactor', '')
            }
            defaultValue={defaultDeviationFactor}
            onChange={value => {
              setDoDebounceDeviationFactor(true);
              setTempThresholdDeviationFactor(value);

              const onChangCallback = () => {
                onChange(['threshold', 'deviationFactor'], f => f.setValue(value).setTouched(true));
                setDoDebounceDeviationFactor(false);
              };

              debounceOnChange$.emit(onChangCallback.bind(this));
              debouncedThresholdDeviationFactorChangedTracker(getTrackingObject(form, { value }));
            }}
          />
        </ThresholdConditionFormGroup>
      )}
    </>
  );
}

function getThresholdComboBoxValue(form) {
  let result = form.get('threshold').get('type').value;
  if (form.get('threshold').get('seasonality')) {
    result += '.' + form.get('threshold').get('seasonality').value;
  }
  return result;
}

function getFormValueOrDefault(form, key, defaultValue = null) {
  return form.containsKey(key) ? form.get(key).value : defaultValue;
}

ThroughputInteractiveChart.propTypes = {
  debounceOnChange$: PropTypes.object,
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
