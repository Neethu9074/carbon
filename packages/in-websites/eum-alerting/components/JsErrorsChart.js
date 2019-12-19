import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames, selectOptions } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import JsErrorsAlertingBarChart from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChart';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';

import locals from './JsErrorsChart.mless';

const errorCount = selectOptions[fieldNames.ruleMetricName][0].value;

export default function JsErrorsChart({ form, timeConfig, onChange, granularity }) {
  return (
    <div className={locals.container}>
      {hasJsErrorSelected(form) ? (
        <>
          {onChange && (
            <div className={locals.controls}>
              <FormGroup>
                <ComboBox
                  className={locals.metricSelect}
                  name={fieldNames.ruleMetricName}
                  value={form.get(fieldNames.ruleMetricName).value}
                  options={selectOptions[fieldNames.ruleMetricName]}
                  onChange={e => {
                    const doCalculateTresholdOnBackend = { name: fieldNames.calculateThresholdOnBackend, value: true };
                    onChange(form, fieldNames.ruleMetricName, (e && e.value) || '', doCalculateTresholdOnBackend);
                  }}
                  defaultValue={selectOptions[fieldNames.ruleMetricName][0].value}
                  clearable={false}
                />
              </FormGroup>
              <FormGroup>
                <ComboBox
                  className={locals.metricSelect}
                  name={fieldNames.thresholdOperator}
                  value={form.get(fieldNames.thresholdOperator).value}
                  options={selectOptions[fieldNames.thresholdOperator]}
                  onChange={e => {
                    const doCalculateTresholdOnBackend = { name: fieldNames.calculateThresholdOnBackend, value: true };
                    onChange(form, fieldNames.thresholdOperator, (e && e.value) || '', doCalculateTresholdOnBackend);
                  }}
                  defaultValue={selectOptions[fieldNames.thresholdOperator][0].value}
                  clearable={false}
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="number"
                  min="0"
                  name={fieldNames.thresholdValue}
                  value={
                    form.get(fieldNames.thresholdValue).value == null ? '' : form.get(fieldNames.thresholdValue).value
                  }
                  step={form.get(fieldNames.ruleMetricName).value === errorCount ? 1 : 0.01}
                  onChange={e =>
                    onChange(form, fieldNames.thresholdValue, e.target.value !== '' ? Math.abs(e.target.value) : '')
                  }
                />
              </FormGroup>
            </div>
          )}
          <div className={locals.placeholder}>
            <JsErrorsAlertingBarChart
              websiteId={form.get(fieldNames.websiteId).value}
              threshold={form.get(fieldNames.thresholdValue).value || 0}
              timeConfig={timeConfig}
              tagFilters={form.get(fieldNames.tagFilters).value}
              errorFilter={{
                name: 'beacon.error.message',
                operator: form.get(fieldNames.ruleOperator).value,
                stringValue: form.get(fieldNames.ruleValue).value
              }}
              metricName={form.get(fieldNames.ruleMetricName).value}
              granularity={granularity}
            />
          </div>
        </>
      ) : (
        <div className={locals.message}>
          <SvgIcon type="lib_help_error_error_outline" size="xs" />
          <span>Please select a JS Error to see when this alert triggers</span>
        </div>
      )}
    </div>
  );
}

JsErrorsChart.propTypes = {
  form: PropTypes.object.isRequired,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  timeConfig: PropTypes.object.isRequired
};

function hasJsErrorSelected(form) {
  return !!(form && form.get(fieldNames.ruleValue).value);
}
