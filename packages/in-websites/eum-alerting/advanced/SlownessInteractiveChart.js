import { create } from 'reactive-observables';
import React, { useState } from 'react';
import compose from 'recompose/compose';
import { withState } from 'recompose';
import PropTypes from 'prop-types';

import {
  getBlueprintObject,
  debouncedThresholdValueChangedTracker,
  debouncedThresholdDeviationFactorChangedTracker
} from 'in-websites/eum-alerting/trackingHelpers';
import {
  websitesAlertingAggregationChanged,
  websitesAlertingThresholdOperatorChanged,
  websitesAlertingThresholdTypeChanged
} from 'in-websites/eum-alerting/tracker';
import { ruleAggregationForWeeklySeasonalityOptions } from 'in-websites/eum-alerting/form/ruleFormData';
import { getFormValueOrDefault, getThresholdLabel } from 'in-websites/eum-alerting/formHelpers';
import SlownessAlertingBarChart from 'in-websites/eum-alerting/chart/SlownessAlertingBarChart';
import { thresholdOperatorOptions, thresholdTypeOptions } from '../form/thresholdFormData';
import { ruleAggregationOptions } from 'in-websites/eum-alerting/form/ruleFormData';
import ChartContainer from 'in-new-components/Alerting/components/ChartContainer';
import createThresholdForm from 'in-websites/eum-alerting/form/thresholdForm';
import createRuleForm from 'in-websites/eum-alerting/form/ruleForm';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import ComboBox from 'in-components/ComboBox/ComboBox';
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

function SlownessInteractiveChart({ form, timeConfig, onChange, granularity, debounceOnChange$, updateForm }) {
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
      <div className={locals.controls}>
        <FormGroup>
          <Label htmlFor={'ruleAggregation'}>Aggregation</Label>
          <ComboBox
            id="ruleAggregation"
            className={locals.wideControl}
            name="ruleAggregation"
            value={getAggregationValueAndUpdateFormIfNeeded(form, updateForm)}
            options={getAggregationOptions(form)}
            onChange={e => {
              const value = (e && e.value) || '';
              updateForm(
                form
                  .updateIn(['rule', 'aggregation'], f => f.setValue(value).setTouched(true))
                  .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
              );

              websitesAlertingAggregationChanged({ ...getBlueprintObject(form), value });
            }}
            defaultValue="P90"
            clearable={false}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="thresholdOperator">Operator</Label>
          <ComboBox
            id="thresholdOperator"
            className={locals.narrowControl}
            name="thresholdOperator"
            value={form.get('threshold').get('operator').value}
            options={thresholdOperatorOptions}
            onChange={e => {
              const value = (e && e.value) || '';
              onChange(['threshold', 'operator'], f => f.setValue(value).setTouched(true));
              websitesAlertingThresholdOperatorChanged({ ...getBlueprintObject(form), value: e.value });
            }}
            defaultValue=">="
            clearable={false}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="thresholdType">Threshold Type</Label>
          <ComboBox
            id="thresholdType"
            className={locals.wideControl}
            name="thresholdType"
            value={form.get('threshold').get('type').value}
            options={thresholdTypeOptions}
            onChange={e => {
              const thresholdType = e.value || '';

              const newRuleForm = createRuleForm(form.get('rule').toJS(), thresholdType);

              const newThresholdForm = createThresholdForm(
                {
                  ...form.get('threshold').toJS(),
                  type: thresholdType,
                  seasonality: thresholdType === 'historicBaseline.DAILY' ? 'DAILY' : 'WEEKLY'
                },
                form.get('rule').get('alertType').value
              );

              updateForm(
                form
                  .put('rule', newRuleForm)
                  .put('threshold', newThresholdForm)
                  .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
              );

              websitesAlertingThresholdTypeChanged({ ...getBlueprintObject(form), value: thresholdType });
            }}
            defaultValue="staticThreshold"
            clearable={false}
          />
        </FormGroup>
        {form.get('threshold').get('type').value === 'staticThreshold' ? (
          <FormGroup>
            <Label htmlFor="thresholdValue">{getThresholdLabel(form)}</Label>
            <Input
              id="thresholdValue"
              className={locals.narrowControl}
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
          </FormGroup>
        ) : (
          <FormGroup>
            <Label htmlFor="thresholdDeviationFactor">Sensitivity</Label>
            <Input
              id="thresholdDeviationFactor"
              className={locals.narrowControl}
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
          </FormGroup>
        )}
      </div>

      <ChartContainer headline="Last 24 hours">
        <SlownessAlertingBarChart
          websiteId={form.get('websiteId').value}
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
          alertsPreviewEnabled
          canReload
        />
      </ChartContainer>
    </div>
  );
}

function getAggregationValueAndUpdateFormIfNeeded(form, updateForm) {
  const aggregationOptions = getAggregationOptions(form);
  let aggregationValue = form.get('rule').get('aggregation').value;
  if (!aggregationOptions.find(e => e.value === aggregationValue)) {
    aggregationValue = aggregationOptions[0].value;
    updateForm(
      form
        .updateIn(['rule', 'aggregation'], f => f.setValue(aggregationValue).setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
  }
  return aggregationValue;
}

function getAggregationOptions(form) {
  if (getFormValueOrDefault(form.get('threshold'), 'type') === 'historicBaseline.WEEKLY') {
    return ruleAggregationForWeeklySeasonalityOptions;
  }
  return ruleAggregationOptions;
}

SlownessInteractiveChart.propTypes = {
  debounceOnChange$: PropTypes.object,
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};
