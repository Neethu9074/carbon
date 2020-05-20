import { create } from 'reactive-observables';
import React, { useState } from 'react';
import compose from 'recompose/compose';
import { withState } from 'recompose';
import PropTypes from 'prop-types';

import {
  applicationsAlertingThresholdAggregationChanged,
  applicationsAlertingThresholdOperatorChanged,
  applicationsAlertingThresholdTypeChanged
} from 'in-applications/alerting/tracker';
import {
  getBlueprintObject,
  debouncedThresholdValueChangedTracker,
  debouncedThresholdDeviationFactorChangedTracker
} from 'in-applications/alerting/trackingHelpers';
import {
  ruleAggregationForWeeklySeasonalityOptions,
  ruleAggregationOptions,
  ruleMetricNameOptions
} from 'in-applications/alerting/form/ruleFormData';
import {
  thresholdTypeOptions,
  enrichThresholdOperatorOptionsForApiConfigs
} from 'in-applications/alerting/form/thresholdFormData';
import { getFormValueOrDefault, getThresholdLabel, findEntryByValue } from 'in-applications/alerting/form/formUtils';
import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';
import ChartViewConfigurator from 'in-new-components/Alerting/components/ChartViewConfigurator';
import SlownessAlertingBarChart from 'in-applications/alerting/chart/SlownessAlertingBarChart';
import { createSlownessForm } from 'in-applications/alerting/form/thresholdForm';
import createRuleForm from 'in-applications/alerting/form/ruleForm';
import Dropdown from 'in-new-components/Dropdown';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';

import locals from './InteractiveChart.mless';

export default compose(
  withState('debounceOnChange$', '', create({ emitLatestOnSubscribe: false })),
  connectTo(({ debounceOnChange$ }) => ({
    debounce: debounceOnChange$.debounce(300).tap(callback => callback())
  }))
)(SlownessInteractiveChart);

function SlownessInteractiveChart({
  form,
  onChange,
  debounceOnChange$,
  updateForm,
  onChartConfigChange,
  indexInitialSelectedTimeConfig
}) {
  const [tempThreshold, setTempThreshold] = useState(() => getFormValueOrDefault(form.get('threshold'), 'value'));
  const [tempThresholdDeviationFactor, setTempThresholdDeviationFactor] = useState(() =>
    getFormValueOrDefault(form.get('threshold'), 'deviationFactor')
  );
  const [doDebounceThreshold, setDoDebounceThreshold] = useState(false);
  const [doDebounceDeviationFactor, setDoDebounceDeviationFactor] = useState(false);

  const threshold = {
    ...form.get('threshold').toJS(),
    value: (doDebounceThreshold ? tempThreshold : getFormValueOrDefault(form.get('threshold'), 'value')) || 0,
    baseline: getFormValueOrDefault(form.get('threshold'), 'baseline') || []
  };
  return (
    <div className={locals.container}>
      {renderThresholdCondition(
        form,
        updateForm,
        onChange,
        debounceOnChange$,
        onChartConfigChange,
        indexInitialSelectedTimeConfig,
        doDebounceThreshold,
        doDebounceDeviationFactor,
        setDoDebounceThreshold,
        setDoDebounceDeviationFactor,
        threshold,
        tempThreshold,
        setTempThreshold,
        tempThresholdDeviationFactor,
        setTempThresholdDeviationFactor
      )}

      <ChartViewConfigurator
        onChartConfigChange={onChartConfigChange}
        indexInitialSelectedTimeConfig={indexInitialSelectedTimeConfig}
        className={locals.chartContainer}
        headerTransparent
      >
        {({ timeConfig, granularity }) => (
          <SlownessAlertingBarChart
            applicationId={form.get('applicationId').value}
            threshold={threshold}
            timeThreshold={form.get('timeThreshold').toJS()}
            sensitivity={Number(
              doDebounceDeviationFactor
                ? tempThresholdDeviationFactor
                : getFormValueOrDefault(form.get('threshold'), 'deviationFactor', 0)
            )}
            timeConfig={timeConfig}
            tagFilters={form.get('tagFilters').value}
            aggregation={form.get('rule').get('aggregation').value}
            granularity={granularity}
            boundaryScope={form.get('boundaryScope').value}
            alertsPreviewEnabled
            canReload
          />
        )}
      </ChartViewConfigurator>
    </div>
  );
}

export function renderThresholdCondition(
  form,
  updateForm,
  onChange,
  debounceOnChange$,
  onChartConfigChange,
  indexInitialSelectedTimeConfig,
  doDebounceThreshold,
  doDebounceDeviationFactor,
  setDoDebounceThreshold,
  setDoDebounceDeviationFactor,
  threshold,
  tempThreshold,
  setTempThreshold,
  tempThresholdDeviationFactor,
  setTempThresholdDeviationFactor
) {
  const operatorValue = form.get('threshold').get('operator').value;
  const operatorOptions = enrichThresholdOperatorOptionsForApiConfigs(operatorValue);
  const operatorLabel = operatorOptions.find(op => op.value === operatorValue).label;
  const thresholdType = form.get('threshold').get('type')?.value;

  return (
    <>
      <ThresholdConditionFormGroup>
        <Label>{ruleMetricNameOptions.slowness[0].label}</Label>
        <Dropdown
          asSimpleDropdown
          name="ruleAggregation"
          label={getAggregationLabelAndUpdateFormIfNeeded(form, updateForm)}
          items={getAggregationOptions(form)}
          onClick={e => {
            const value = (e && e.value) || '';
            updateForm(
              form
                .updateIn(['rule', 'aggregation'], f => f.setValue(value).setTouched(true))
                .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
            );
            applicationsAlertingThresholdAggregationChanged({ ...getBlueprintObject(form), value });
          }}
          defaultValue="P90"
        />
        <Dropdown
          asSimpleDropdown
          name="thresholdOperator"
          label={operatorLabel}
          items={operatorOptions}
          onClick={e => {
            const value = (e && e.value) || '';
            onChange(['threshold', 'operator'], f => f.setValue(value).setTouched(true));
            applicationsAlertingThresholdOperatorChanged({ ...getBlueprintObject(form), value: e.value });
          }}
        />
        <Dropdown
          asSimpleDropdown
          name="thresholdType"
          label={findEntryByValue(thresholdTypeOptions, getThresholdComboBoxValue(form))?.label}
          items={thresholdTypeOptions}
          onClick={e => {
            const value = e.value || '';
            const valueParts = value.split('.');
            const thresholdType = valueParts[0];

            let newThresholdForm = createSlownessForm({
              ...form.get('threshold').toJS(),
              type: thresholdType,
              operator: null // reset to default value (happens in createSlownessForm)
            });

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

            applicationsAlertingThresholdTypeChanged({ ...getBlueprintObject(form), value: thresholdType });
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
              const value = e.target.value !== '' ? Math.abs(e.target.value) : '';

              setDoDebounceThreshold(true);
              setTempThreshold(value);

              const onChangCallback = () => {
                onChange(['threshold', 'value'], f => f.setValue(value).setTouched(true));
                setDoDebounceThreshold(false);
              };

              debounceOnChange$.emit(onChangCallback.bind(this));
              debouncedThresholdValueChangedTracker({ ...getBlueprintObject(form), value });
            }}
          />

          <Label className={locals.formLabel} htmlFor="thresholdValue">
            {getThresholdLabel(form)}
          </Label>
        </ThresholdConditionFormGroup>
      )}
      {thresholdType !== 'staticThreshold' && (
        <ThresholdConditionFormGroup iconType="lib_threshold" label="Sensitivity">
          <Input
            id="thresholdDeviationFactor"
            type="number"
            min="0"
            name="thresholdDeviationFactor"
            value={
              doDebounceDeviationFactor
                ? tempThresholdDeviationFactor
                : getFormValueOrDefault(form.get('threshold'), 'deviationFactor', '')
            }
            step="0.1"
            onChange={e => {
              const value = e.target.value !== '' ? Math.abs(e.target.value) : '';

              setDoDebounceDeviationFactor(true);
              setTempThresholdDeviationFactor(value);

              const onChangCallback = () => {
                onChange(['threshold', 'deviationFactor'], f => f.setValue(value).setTouched(true));
                setDoDebounceDeviationFactor(false);
              };

              debounceOnChange$.emit(onChangCallback.bind(this));
              debouncedThresholdDeviationFactorChangedTracker({ ...getBlueprintObject(form), value });
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
  debounceOnChange$: PropTypes.object,
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  onChartConfigChange: PropTypes.func.isRequired,
  indexInitialSelectedTimeConfig: PropTypes.number.isRequired
};
