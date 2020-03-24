import { withState, compose } from 'recompose';
import { create } from 'reactive-observables';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  getThresholdValueForPercentageMetric,
  getValueRoundedToDecimals,
  round
} from 'in-new-components/Alerting/utils/formatUtils';
import {
  websitesAlertingThresholdMetricChanged,
  websitesAlertingThresholdOperatorChanged
} from 'in-websites/eum-alerting/tracker';
import { getBlueprintObject, debouncedThresholdValueChangedTracker } from 'in-websites/eum-alerting/trackingHelpers';
import { fieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import StatusCodeAlertingBarChart from 'in-websites/eum-alerting/chart/StatusCodeAlertingBarChart';
import { isPercentageMetric, getThresholdLabel } from 'in-websites/eum-alerting/formHelpers';
import { statusCodeCount, statusCodeRate } from 'in-websites/eum-alerting/constants';
import { ruleMetricNameOptions } from 'in-websites/eum-alerting/form/ruleFormData';
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
)(StatusCodeInteractiveChart);

function StatusCodeInteractiveChart({ form, timeConfig, onChange, granularity, debounceOnChange$, updateForm }) {
  const [tempThreshold, setTempThreshold] = useState(() => form.get(fieldNames.thresholdValue).value);
  const [doDebounce, setDoDebounce] = useState(false);

  const metricName = form.get('rule').get('metricName').value;
  const percentageMetric = isPercentageMetric(metricName);

  const threshold = {
    ...getThreshold(form),
    value:
      (doDebounce
        ? getThresholdValueForPercentageMetric(tempThreshold, percentageMetric)
        : form.get(fieldNames.thresholdValue).value) || 0
  };

  return (
    <div className={locals.container}>
      <div className={locals.controls}>
        <FormGroup>
          <Label htmlFor={'ruleMetricName'}>Metric</Label>
          <ComboBox
            id={'ruleMetricName'}
            className={locals.wideControl}
            name={'ruleMetricName'}
            value={metricName}
            options={ruleMetricNameOptions.statusCode}
            onChange={e => {
              const value = (e && e.value) || '';

              updateForm(
                form
                  .updateIn(['rule', 'metricName'], f => f.setValue(value).setTouched(true))
                  .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
              );

              websitesAlertingThresholdMetricChanged({ ...getBlueprintObject(form), value });
            }}
            defaultValue={statusCodeCount}
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
              websitesAlertingThresholdOperatorChanged({ ...getBlueprintObject(form), value });
            }}
            defaultValue={selectOptions[fieldNames.thresholdOperator][0].value}
            clearable={false}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor={fieldNames.thresholdValue}>{getThresholdLabel(form)}</Label>
          <Input
            id={fieldNames.thresholdValue}
            className={locals.narrowControl}
            type="number"
            min="0"
            max={getMaxThresholdValue(metricName)}
            name={fieldNames.thresholdValue}
            step="1"
            value={
              doDebounce
                ? tempThreshold
                : getValueRoundedToDecimals(form.get(fieldNames.thresholdValue).value, percentageMetric)
            }
            onChange={e => {
              let value = e.target.value !== '' ? Math.abs(e.target.value) : '';

              if (value !== '') {
                value = percentageMetric ? round(Math.abs(value) / 100, 3) : Math.abs(value);
              }

              setDoDebounce(true);
              setTempThreshold(getValueRoundedToDecimals(value, percentageMetric));

              const onChangCallback = () => {
                onChange([fieldNames.thresholdValue], f => f.setValue(value).setTouched(true));
                setDoDebounce(false);
              };

              debounceOnChange$.emit(onChangCallback.bind(this));
              debouncedThresholdValueChangedTracker({ ...getBlueprintObject(form), value });
            }}
          />
        </FormGroup>
      </div>

      <ChartContainer headline="Last 24 hours">
        <StatusCodeAlertingBarChart
          websiteId={form.get(fieldNames.websiteId).value}
          threshold={threshold}
          timeThreshold={form.get('timeThreshold').toJS()}
          timeConfig={timeConfig}
          tagFilters={form.get(fieldNames.tagFilters).value}
          numeratorFilter={{
            name: 'beacon.http.status',
            operator: form.get('rule').get('operator').value,
            stringValue: form.get('rule').get('value').value
          }}
          metricName={metricName}
          granularity={granularity}
          alertsPreviewEnabled
          canReload
        />
      </ChartContainer>
    </div>
  );
}

StatusCodeInteractiveChart.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired,
  debounceOnChange$: PropTypes.object,
  updateForm: PropTypes.func.isRequired
};

function getMaxThresholdValue(metricName) {
  return isRateMetric(metricName) ? 100 : undefined;
}

function isRateMetric(metricName) {
  return metricName === statusCodeRate;
}
