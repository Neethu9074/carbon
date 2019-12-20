import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames, selectOptions } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import EumAlertingBarChart from 'in-websites/eum-alerting/chart/EumAlertingBarChart';
import { getFormValueOrDefault } from 'in-websites/eum-alerting/AlertConfigDialog';
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
                defaultValue="MEAN"
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
                defaultValue=">="
                clearable={false}
              />
            </FormGroup>
            <FormGroup>
              <ComboBox
                className={locals.metricSelect}
                name={fieldNames.thresholdType}
                value={form.get(fieldNames.thresholdType).value}
                options={selectOptions[fieldNames.thresholdType]}
                onChange={e => {
                  const doCalculateThresholdOnBackend = { name: fieldNames.calculateThresholdOnBackend, value: true };
                  const seasonality = {
                    name: fieldNames.thresholdSeasonality,
                    value: e.value === 'historicBaseline.DAILY' ? 'DAILY' : 'WEEKLY'
                  };
                  onChange(
                    form,
                    fieldNames.thresholdType,
                    (e && e.value) || '',
                    doCalculateThresholdOnBackend,
                    seasonality
                  );
                }}
                defaultValue="staticThreshold"
                clearable={false}
              />
            </FormGroup>
            {form.get(fieldNames.thresholdType).value === 'staticThreshold' ? (
              <FormGroup>
                <Input
                  type="number"
                  min="0"
                  name={fieldNames.thresholdValue}
                  value={getFormValueOrDefault(form, fieldNames.thresholdValue, '')}
                  step="1"
                  onChange={e =>
                    onChange(form, fieldNames.thresholdValue, e.target.value !== '' ? Math.abs(e.target.value) : '')
                  }
                />
              </FormGroup>
            ) : (
              <FormGroup>
                <Input
                  type="number"
                  min="0"
                  name={fieldNames.thresholdDeviationFactor}
                  value={getFormValueOrDefault(form, fieldNames.thresholdDeviationFactor, 1)}
                  step="0.1"
                  onChange={e =>
                    onChange(
                      form,
                      fieldNames.thresholdDeviationFactor,
                      e.target.value !== '' ? Math.abs(e.target.value) : ''
                    )
                  }
                />
              </FormGroup>
            )}
          </div>
        )}
      <div className={locals.placeholder}>
        <EumAlertingBarChart
          websiteId={form.get(fieldNames.websiteId).value}
          thresholdType={form.get(fieldNames.thresholdType).value}
          threshold={getFormValueOrDefault(form, fieldNames.thresholdValue)}
          sensitivity={getFormValueOrDefault(form, fieldNames.thresholdDeviationFactor)}
          baseline={getFormValueOrDefault(form, fieldNames.thresholdBaseline, [])}
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
