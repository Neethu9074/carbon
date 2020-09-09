import { create } from 'reactive-observables';
import React, { useState } from 'react';
import compose from 'recompose/compose';
import { withState } from 'recompose';
import PropTypes from 'prop-types';

import {
  websitesAlertingAggregationChanged,
  websitesAlertingThresholdOperatorChanged,
  websitesAlertingThresholdTypeChanged
} from 'in-websites/alerting/tracker';
import {
  debouncedThresholdValueChangedTracker,
  debouncedThresholdDeviationFactorChangedTracker
} from 'in-websites/alerting/trackingHelpers';
import {
  ruleAggregationForWeeklySeasonalityOptions,
  ruleAggregationOptions
} from 'in-websites/alerting/form/ruleFormData';
import {
  thresholdTypeOptions,
  enrichThresholdOperatorOptionsForApiConfigs
} from 'in-new-components/Alerting/advanced/thresholdFormData';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import createThresholdForm, { defaultDeviationFactor } from 'in-websites/alerting/form/thresholdForm';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import { getFormValueOrDefault, getThresholdLabel } from 'in-websites/alerting/form/formUtils';
import { SensitivitySlider } from 'in-new-components/Alerting/advanced/SensitivitySlider';
import { getTrackingObject } from 'in-new-components/Alerting/trackingHelpers';
import { blueprintConfigPropType } from 'in-new-components/Alerting/constants';
import { findEntryByValue } from 'in-new-components/Alerting/utils/formUtils';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';
import createRuleForm from 'in-websites/alerting/form/ruleForm';
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
)(SlownessInteractiveChart);

function SlownessInteractiveChart({
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

  const metricName = form.get('rule').get('metricName');
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
        {...{
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
          metricName,
          setTempThreshold,
          tempThresholdDeviationFactor,
          setTempThresholdDeviationFactor
        }}
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

export function ThresholdCondition({
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
  metricName,
  setTempThreshold,
  tempThresholdDeviationFactor,
  setTempThresholdDeviationFactor
}) {
  const operatorValue = form.get('threshold').get('operator').value;
  const operatorOptions = enrichThresholdOperatorOptionsForApiConfigs(operatorValue);
  const operatorLabel = operatorOptions.find(op => op.value === operatorValue).label;

  const thresholdType = form.get('threshold').get('type')?.value;

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
            websitesAlertingAggregationChanged(getTrackingObject(form, { value }));
          }}
        />
        <Dropdown
          asSimpleDropdown
          label={operatorLabel}
          items={operatorOptions}
          onChange={({ value = '' }) => {
            onChange(['threshold', 'operator'], f => f.setValue(value).setTouched(true));
            websitesAlertingThresholdOperatorChanged(getTrackingObject(form, { value }));
          }}
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
                type: thresholdType,
                operator: null // reset to default value (happens in createThresholdForm)
              },
              form.get('rule').get('alertType').value
            );

            if (valueParts.length > 1) {
              const seasonality = valueParts[1];
              newThresholdForm = newThresholdForm.updateIn(['seasonality'], f => f.setValue(seasonality).setTouched());
            }

            const newRuleForm = createRuleForm({ ...form.get('rule').toJS(), aggregation: null }); // reset to default value (happens in createRuleForm)

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
          <Input
            id="thresholdValue"
            type="number"
            min="0"
            name="thresholdValue"
            value={doDebounceThreshold ? tempThreshold : getFormValueOrDefault(form.get('threshold'), 'value')}
            step="1"
            onChange={({ target }) => {
              let value = '';
              if (target.value !== '') {
                value = Math.abs(target.value);
              }

              setDoDebounceThreshold(true);
              setTempThreshold(value);

              const onChangCallback = () => {
                onChange(['threshold', 'value'], f => f.setValue(value).setTouched(true));
                setDoDebounceThreshold(false);
              };

              debounceOnChange$.emit(onChangCallback.bind(this));
              debouncedThresholdValueChangedTracker(getTrackingObject(form, { value }));
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
  debounceOnChange$: PropTypes.object,
  blueprintConfig: blueprintConfigPropType,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartViewConfigChange: PropTypes.func.isRequired,
  selectedChartViewConfigIndex: PropTypes.number.isRequired
};
