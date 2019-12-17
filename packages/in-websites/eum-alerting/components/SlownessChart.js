import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames, selectOptions } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import EumAlertingLineChart from 'in-websites/eum-alerting/chart/EumAlertingLineChart';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Input from 'in-components/form/Input';

import locals from './JsErrorsChart.mless';

export default function SlownessChart({ form, timeConfig, onChange, granularity }) {
  return (
    <div className={locals.container}>
      {onChange &&
        form && (
          <div className={locals.controls}>
            <FormGroup>
              <ComboBox
                className={locals.metricSelect}
                name={fieldNames.ruleAggregation}
                value={form.get(fieldNames.ruleAggregation).value}
                options={selectOptions[fieldNames.ruleAggregation]}
                onChange={e => {
                  const doCalculateTresholdOnBackend = { name: fieldNames.calculateThresholdOnBackend, value: true };
                  onChange(form, fieldNames.ruleAggregation, (e && e.value) || '', doCalculateTresholdOnBackend);
                }}
                defaultValue={selectOptions[fieldNames.ruleAggregation][0].value}
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
                step="1"
                onChange={e =>
                  onChange(form, fieldNames.thresholdValue, e.target.value !== '' ? Math.abs(e.target.value) : '')
                }
              />
            </FormGroup>
          </div>
        )}
      <div className={locals.placeholder}>
        <EumAlertingLineChart
          threshold={form.get(fieldNames.thresholdValue).value || 0}
          timeConfig={timeConfig}
          tagFilters={form.get(fieldNames.tagFilters).value}
          aggregation={form.get(fieldNames.ruleAggregation).value}
          granularity={granularity}
        />
      </div>
    </div>
  );
}

SlownessChart.propTypes = {
  form: PropTypes.object,
  granularity: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  timeConfig: PropTypes.object.isRequired
};
