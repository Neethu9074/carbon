import { create } from 'reactive-observables';
import React, { useState } from 'react';
import compose from 'recompose/compose';
import { withState } from 'recompose';
import PropTypes from 'prop-types';

import {
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdTypeChanged
} from 'in-applications/alerting/tracker';
import {
  debouncedThresholdValueChangedTracker,
  debouncedThresholdDeviationFactorChangedTracker
} from 'in-applications/alerting/trackingHelpers';
import { thresholdTypeOptions, thresholdOperatorOptions } from 'in-new-components/Alerting/advanced/thresholdFormData';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import { createThroughputForm, defaultDeviationFactor } from 'in-applications/alerting/form/thresholdForm';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { isDifferentOperatorDirection } from 'in-new-components/Alerting/utils/alertUtils';
import { SensitivitySlider } from 'in-new-components/Alerting/advanced/SensitivitySlider';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { blueprintConfigPropType } from 'in-new-components/Alerting/constants';
import { findEntryByValue } from 'in-new-components/Alerting/utils/formUtils';
import { getThresholdLabel } from 'in-applications/alerting/form/formUtils';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
import createRuleForm from 'in-applications/alerting/form/ruleForm';
import Dropdown from 'in-new-components/Alerting/Dropdown';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';

import locals from 'in-new-components/Alerting/shared-styles/InteractiveChart.mless';

export default compose(
  withState('debounceOnChange$', '', create({ emitLatestOnSubscribe: false })),
  connectTo(({ debounceOnChange$ }) => ({
    debounce: debounceOnChange$.debounce(300).tap(callback => callback())
  }))
)(ThroughputInteractiveChart);

function ThroughputInteractiveChart({
  blueprintConfig,
  form,
  onChange,
  debounceOnChange$,
  updateForm,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}) {
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
              operator: null, // reset to default value (happens in createSlownessForm)
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
            name="thresholdValue"
            value={doDebounceThreshold ? tempThreshold : getFormValueOrDefault(form.get('threshold'), 'value')}
            step="1"
            onChange={e => {
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

          <Label className={locals.formLabel} htmlFor="thresholdValue">
            {getThresholdLabel(form)}
          </Label>
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
