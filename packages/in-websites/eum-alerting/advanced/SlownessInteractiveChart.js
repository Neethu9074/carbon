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
import {
  withSlownessFormStaticThreshold,
  withSlownessFormHistoricBaseline
} from 'in-websites/eum-alerting/form/slownessForm';
import { fieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { getFormValueOrDefault, getThresholdLabel } from 'in-websites/eum-alerting/formHelpers';
import SlownessAlertingBarChart from 'in-websites/eum-alerting/chart/SlownessAlertingBarChart';
import ChartContainer from 'in-new-components/Alerting/components/ChartContainer';
import { getThreshold } from 'in-websites/eum-alerting/alertConfigUtil';
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
  const [tempThreshold, setTempThreshold] = useState(() => getFormValueOrDefault(form, fieldNames.thresholdValue));
  const [tempThresholdDeviationFactor, setTempThresholdDeviationFactor] = useState(() =>
    getFormValueOrDefault(form, fieldNames.thresholdDeviationFactor)
  );
  const [doDebounceThreshold, setDoDebounceThreshold] = useState(false);
  const [doDebounceDeviationFactor, setDoDebounceDeviationFactor] = useState(false);

  const threshold = {
    ...getThreshold(form),
    value: (doDebounceThreshold ? tempThreshold : getFormValueOrDefault(form, fieldNames.thresholdValue)) || 0,
    baseline: getFormValueOrDefault(form, fieldNames.thresholdBaseline) || []
  };

  return (
    <div className={locals.container}>
      <div className={locals.controls}>
        <FormGroup>
          <Label htmlFor={fieldNames.ruleAggregation}>Aggregation</Label>
          <ComboBox
            id={fieldNames.ruleAggregation}
            className={locals.wideControl}
            name={fieldNames.ruleAggregation}
            value={getAggregationValueAndUpdateFormIfNeeded(form, updateForm)}
            options={getAggregationOptions(form)}
            onChange={e => {
              const value = (e && e.value) || '';
              updateForm(
                form
                  .updateIn([fieldNames.ruleAggregation], f => f.setValue(value).setTouched(true))
                  .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
              );

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
              onChange([fieldNames.thresholdOperator], f => f.setValue(value).setTouched(true));
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

              let newForm = form;
              if (thresholdType === 'staticThreshold') {
                newForm = withSlownessFormStaticThreshold(form);
              }

              if (thresholdType.startsWith('historicBaseline.')) {
                newForm = withSlownessFormHistoricBaseline(form);
              }

              updateForm(
                newForm
                  .updateIn([fieldNames.thresholdType], f => f.setValue(thresholdType).setTouched(true))
                  .updateIn([fieldNames.thresholdSeasonality], f =>
                    f.setValue(thresholdType === 'historicBaseline.DAILY' ? 'DAILY' : 'WEEKLY').setTouched(true)
                  )
                  .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
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
              value={doDebounceThreshold ? tempThreshold : getFormValueOrDefault(form, fieldNames.thresholdValue)}
              step="1"
              onChange={e => {
                const value = e.target.value !== '' ? Math.abs(e.target.value) : '';

                setDoDebounceThreshold(true);
                setTempThreshold(value);

                const onChangCallback = () => {
                  onChange([fieldNames.thresholdValue], f => f.setValue(value).setTouched(true));
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
                  onChange([fieldNames.thresholdDeviationFactor], f => f.setValue(value).setTouched(true));
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
          websiteId={form.get(fieldNames.websiteId).value}
          threshold={threshold}
          timeThreshold={form.get('timeThreshold').toJS()}
          sensitivity={
            doDebounceDeviationFactor
              ? tempThresholdDeviationFactor
              : getFormValueOrDefault(form, fieldNames.thresholdDeviationFactor, 0)
          }
          timeConfig={timeConfig}
          tagFilters={form.get(fieldNames.tagFilters).value}
          aggregation={form.get(fieldNames.ruleAggregation).value}
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
  let aggregationValue = form.get(fieldNames.ruleAggregation).value;
  if (!aggregationOptions.find(e => e.value === aggregationValue)) {
    aggregationValue = aggregationOptions[0].value;
    updateForm(
      form
        .updateIn([fieldNames.ruleAggregation], f => f.setValue(aggregationValue).setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
  }
  return aggregationValue;
}

function getAggregationOptions(form) {
  if (getFormValueOrDefault(form, fieldNames.thresholdType) === 'historicBaseline.WEEKLY') {
    return selectOptions.ruleAggregationForWeeklySeasonality;
  }
  return selectOptions[fieldNames.ruleAggregation];
}

SlownessInteractiveChart.propTypes = {
  debounceOnChange$: PropTypes.object,
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};
