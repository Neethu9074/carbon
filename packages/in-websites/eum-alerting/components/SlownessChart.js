import { create } from 'reactive-observables';
import React, { useState } from 'react';
import compose from 'recompose/compose';
import { withState } from 'recompose';
import PropTypes from 'prop-types';

import {
  getBlueprintObject,
  debouncedThresholdValueChangedTracker,
  debouncedThresholdDeviationFactorChangedTracker
} from '../trackingHelpers';
import {
  websitesAlertingAggregationChanged,
  websitesAlertingThresholdOperatorChanged,
  websitesAlertingThresholdTypeChanged
} from '../tracker';
import {
  withSlownessFormStaticThreshold,
  withSlownessFormHistoricBaseline
} from 'in-websites/eum-alerting/form/slownessForm';
import { fieldNames, hiddenFieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { getFormValueOrDefault, getThresholdLabel } from 'in-websites/eum-alerting/formHelpers';
import SlownessAlertingBarChart from 'in-websites/eum-alerting/chart/SlownessAlertingBarChart';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import connectTo from 'in-hoc/connectTo';

import locals from './EumChart.mless';

export default compose(
  withState('debounceOnChange$', '', create({ emitLatestOnSubscribe: false })),
  connectTo(({ debounceOnChange$ }) => ({
    debounce: debounceOnChange$.debounce(300).tap(callback => callback())
  }))
)(SlownessChart);

function SlownessChart({ form, timeConfig, onChange, granularity, isReadOnly, debounceOnChange$ }) {
  const [tempThreshold, setTempThreshold] = useState(() => getFormValueOrDefault(form, fieldNames.thresholdValue));
  const [tempThresholdDeviationFactor, setTempThresholdDeviationFactor] = useState(() =>
    getFormValueOrDefault(form, fieldNames.thresholdDeviationFactor)
  );
  const [doDebounceThreshold, setDoDebounceThreshold] = useState(false);
  const [doDebounceDeviationFactor, setDoDebounceDeviationFactor] = useState(false);

  return (
    <div className={locals.container}>
      {onChange &&
        !isReadOnly &&
        form && (
          <div className={locals.controls}>
            <FormGroup>
              <Label htmlFor={fieldNames.ruleAggregation}>Aggregation</Label>
              <ComboBox
                id={fieldNames.ruleAggregation}
                className={locals.wideControl}
                name={fieldNames.ruleAggregation}
                value={getAggregationValueAndUpdateFormIfNeeded(form, onChange)}
                options={getAggregationOptions(form)}
                onChange={e => {
                  const value = (e && e.value) || '';
                  const doCalculateThresholdOnBackend = {
                    name: hiddenFieldNames.calculateThresholdOnBackend,
                    value: true
                  };
                  onChange(form, fieldNames.ruleAggregation, value, doCalculateThresholdOnBackend);
                  websitesAlertingAggregationChanged({ ...getBlueprintObject(form), value });
                }}
                defaultValue="P90"
                clearable={false}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor={fieldNames.thresholdOperator}>Operator</Label>
              <ComboBox
                id={fieldNames.thresholdOperator}
                className={locals.narrowControl}
                name={fieldNames.thresholdOperator}
                value={form.get(fieldNames.thresholdOperator).value}
                options={selectOptions[fieldNames.thresholdOperator]}
                onChange={e => {
                  const value = (e && e.value) || '';
                  const doCalculateThresholdOnBackend = {
                    name: hiddenFieldNames.calculateThresholdOnBackend,
                    value: true
                  };
                  onChange(form, fieldNames.thresholdOperator, value, doCalculateThresholdOnBackend);
                  websitesAlertingThresholdOperatorChanged({ ...getBlueprintObject(form), value: e.value });
                }}
                defaultValue=">="
                clearable={false}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor={fieldNames.thresholdType}>Threshold Type</Label>
              <ComboBox
                id={fieldNames.thresholdType}
                className={locals.wideControl}
                name={fieldNames.thresholdType}
                value={form.get(fieldNames.thresholdType).value}
                options={selectOptions[fieldNames.thresholdType]}
                onChange={e => {
                  const thresholdType = e.value || '';
                  const doCalculateThresholdOnBackend = {
                    name: hiddenFieldNames.calculateThresholdOnBackend,
                    value: true
                  };
                  const seasonality = {
                    name: fieldNames.thresholdSeasonality,
                    value: thresholdType === 'historicBaseline.DAILY' ? 'DAILY' : 'WEEKLY'
                  };

                  let updatedForm = form;
                  if (thresholdType === 'staticThreshold') {
                    updatedForm = withSlownessFormStaticThreshold(form);
                  }

                  if (thresholdType.startsWith('historicBaseline.')) {
                    updatedForm = withSlownessFormHistoricBaseline(form);
                  }

                  onChange(
                    updatedForm,
                    fieldNames.thresholdType,
                    thresholdType,
                    doCalculateThresholdOnBackend,
                    seasonality
                  );

                  websitesAlertingThresholdTypeChanged({ ...getBlueprintObject(form), value: thresholdType });
                }}
                defaultValue="staticThreshold"
                clearable={false}
              />
            </FormGroup>
            {form.get(fieldNames.thresholdType).value === 'staticThreshold' ? (
              <FormGroup>
                <Label htmlFor={fieldNames.thresholdValue}>{getThresholdLabel(form)}</Label>
                <Input
                  id={fieldNames.thresholdValue}
                  className={locals.narrowControl}
                  type="number"
                  min="0"
                  name={fieldNames.thresholdValue}
                  value={
                    doDebounceThreshold ? tempThreshold : getFormValueOrDefault(form, fieldNames.thresholdValue, '')
                  }
                  step="1"
                  onChange={e => {
                    const value = e.target.value !== '' ? Math.abs(e.target.value) : '';

                    setDoDebounceThreshold(true);
                    setTempThreshold(value);

                    const onChangCallback = () => {
                      onChange(form, fieldNames.thresholdValue, value);
                      setDoDebounceThreshold(false);
                    };

                    debounceOnChange$.emit(onChangCallback.bind(this));
                    debouncedThresholdValueChangedTracker({ ...getBlueprintObject(form), value });
                  }}
                />
              </FormGroup>
            ) : (
              <FormGroup>
                <Label htmlFor={fieldNames.thresholdDeviationFactor}>Sensitivity</Label>
                <Input
                  id={fieldNames.thresholdDeviationFactor}
                  className={locals.narrowControl}
                  type="number"
                  min="0"
                  name={fieldNames.thresholdDeviationFactor}
                  value={
                    doDebounceDeviationFactor
                      ? tempThresholdDeviationFactor
                      : getFormValueOrDefault(form, fieldNames.thresholdDeviationFactor, '')
                  }
                  step="0.1"
                  onChange={e => {
                    const value = e.target.value !== '' ? Math.abs(e.target.value) : '';

                    setDoDebounceDeviationFactor(true);
                    setTempThresholdDeviationFactor(value);

                    const onChangCallback = () => {
                      onChange(form, fieldNames.thresholdDeviationFactor, value);
                      setDoDebounceDeviationFactor(false);
                    };

                    debounceOnChange$.emit(onChangCallback.bind(this));
                    debouncedThresholdDeviationFactorChangedTracker({ ...getBlueprintObject(form), value });
                  }}
                />
              </FormGroup>
            )}
          </div>
        )}
      <div className={locals.placeholder}>
        <SlownessAlertingBarChart
          websiteId={form.get(fieldNames.websiteId).value}
          thresholdType={form.get(fieldNames.thresholdType).value}
          threshold={doDebounceThreshold ? tempThreshold : getFormValueOrDefault(form, fieldNames.thresholdValue, 0)}
          operator={form.get(fieldNames.thresholdOperator).value}
          sensitivity={
            doDebounceDeviationFactor
              ? tempThresholdDeviationFactor
              : getFormValueOrDefault(form, fieldNames.thresholdDeviationFactor, 0)
          }
          baseline={getFormValueOrDefault(form, fieldNames.thresholdBaseline, [])}
          timeConfig={timeConfig}
          tagFilters={form.get(fieldNames.tagFilters).value}
          aggregation={form.get(fieldNames.ruleAggregation).value}
          granularity={granularity}
          form={form}
        />
      </div>
    </div>
  );
}

function getAggregationValueAndUpdateFormIfNeeded(form, onChange) {
  const aggregationOptions = getAggregationOptions(form);
  let aggregationValue = form.get(fieldNames.ruleAggregation).value;
  if (!aggregationOptions.find(e => e.value === aggregationValue)) {
    aggregationValue = aggregationOptions[0].value;
    onChange(form, fieldNames.ruleAggregation, aggregationValue, {
      name: hiddenFieldNames.calculateThresholdOnBackend,
      value: true
    });
  }
  return aggregationValue;
}

function getAggregationOptions(form) {
  if (getFormValueOrDefault(form, fieldNames.thresholdType) === 'historicBaseline.WEEKLY') {
    return selectOptions.ruleAggregationForWeeklySeasonality;
  }
  return selectOptions[fieldNames.ruleAggregation];
}

SlownessChart.propTypes = {
  form: PropTypes.object,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  timeConfig: PropTypes.object.isRequired,
  isReadOnly: PropTypes.bool,
  debounceOnChange$: PropTypes.object
};
