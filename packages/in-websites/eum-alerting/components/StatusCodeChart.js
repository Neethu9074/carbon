import { withState, compose } from 'recompose';
import { create } from 'reactive-observables';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  websitesAlertingThresholdMetricChanged,
  websitesAlertingThresholdOperatorChanged
} from 'in-websites/eum-alerting/tracker';
import { fieldNames, selectOptions, hiddenFieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { getBlueprintObject, debouncedThresholdValueChangedTracker } from 'in-websites/eum-alerting/trackingHelpers';
import StatusCodeAlertingBarChart from 'in-websites/eum-alerting/chart/StatusCodeAlertingBarChart';
import { getThresholdLabel, isPercentageMetric } from 'in-websites/eum-alerting/formHelpers';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import { statusCodeCount } from 'in-websites/eum-alerting/constants';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './EumChart.mless';

export default compose(
  withState('debounceOnChange$', '', create({ emitLatestOnSubscribe: false })),
  connectTo(({ debounceOnChange$ }) => ({
    debounce: debounceOnChange$.debounce(300).tap(callback => callback())
  }))
)(StatusCodeChart);

function StatusCodeChart({ form, timeConfig, onChange, granularity, debounceOnChange$ }) {
  const [tempThreshold, setTempThreshold] = useState(() => form.get(fieldNames.thresholdValue).value);
  const [doDebounce, setDoDebounce] = useState(false);

  const metricName = form.get(fieldNames.ruleMetricName).value;
  const percentageMetric = isPercentageMetric(metricName);

  return (
    <div className={locals.container}>
      {hasStatusCodeSelected(form) ? (
        <>
          {onChange && (
            <div className={locals.controls}>
              <FormGroup>
                <Label htmlFor={fieldNames.ruleMetricName}>Metric</Label>
                <ComboBox
                  id={fieldNames.ruleMetricName}
                  className={locals.wideControl}
                  name={fieldNames.ruleMetricName}
                  value={metricName}
                  options={selectOptions[fieldNames.ruleMetricName][alertTypes.specificStatusCode]}
                  onChange={e => {
                    const value = (e && e.value) || '';
                    const doCalculateThresholdOnBackend = {
                      name: hiddenFieldNames.calculateThresholdOnBackend,
                      value: true
                    };
                    onChange(form, fieldNames.ruleMetricName, value, doCalculateThresholdOnBackend);
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
                    const doCalculateThresholdOnBackend = {
                      name: hiddenFieldNames.calculateThresholdOnBackend,
                      value: true
                    };
                    onChange(form, fieldNames.thresholdOperator, value, doCalculateThresholdOnBackend);
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
                  name={fieldNames.thresholdValue}
                  step="1"
                  value={
                    (doDebounce ? tempThreshold : form.get(fieldNames.thresholdValue).value) *
                    (percentageMetric ? 100 : 1)
                  }
                  onChange={e => {
                    let value = e.target.value !== '' ? Math.abs(e.target.value) : '';

                    if (e.target.value !== '') {
                      value = percentageMetric ? Math.abs(e.target.value) / 100 : Math.abs(e.target.value);
                    }

                    setDoDebounce(true);
                    setTempThreshold(value);

                    const onChangCallback = () => {
                      onChange(form, fieldNames.thresholdValue, value);
                      setDoDebounce(false);
                    };

                    debounceOnChange$.emit(onChangCallback.bind(this));
                    debouncedThresholdValueChangedTracker({ ...getBlueprintObject(form), value });
                  }}
                />
              </FormGroup>
            </div>
          )}
          <div className={locals.placeholder}>
            <StatusCodeAlertingBarChart
              websiteId={form.get(fieldNames.websiteId).value}
              threshold={doDebounce ? tempThreshold : form.get(fieldNames.thresholdValue).value || 0}
              operator={form.get(fieldNames.thresholdOperator).value}
              timeConfig={timeConfig}
              tagFilters={form.get(fieldNames.tagFilters).value}
              numeratorFilter={{
                name: 'beacon.http.status',
                operator: form.get(fieldNames.ruleOperator).value,
                stringValue: form.get(fieldNames.ruleValue).value
              }}
              metricName={metricName}
              granularity={granularity}
              form={form}
            />
          </div>
        </>
      ) : (
        <div className={locals.message}>
          <SvgIcon type="lib_help_error_error_outline" size="xs" />
          <span>Please select a HTTP Status Code to see when this alert triggers</span>
        </div>
      )}
    </div>
  );
}

StatusCodeChart.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  timeConfig: PropTypes.object.isRequired,
  debounceOnChange$: PropTypes.object
};

function hasStatusCodeSelected(form) {
  return !!(form && form.get(fieldNames.ruleValue).value);
}
