import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames, hiddenFieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import JsErrorsAlertingBarChart from 'in-websites/eum-alerting/chart/JsErrorsAlertingBarChart';
import { getThresholdLabel, isPercentageMetric } from 'in-websites/eum-alerting/formHelpers';
import { alertTypes } from 'in-websites/eum-alerting/data/alertTypeConfigData';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import SvgIcon from 'in-components/SvgIcon';

import locals from './EumChart.mless';

const errorCountMetricName = 'errors';

export default function JsErrorsChart({ form, timeConfig, onChange, granularity }) {
  const metricName = form.get(fieldNames.ruleMetricName).value;
  const thresholdValue = form.get(fieldNames.thresholdValue).value;
  const percentageMetric = isPercentageMetric(metricName);

  return (
    <div className={locals.container}>
      {hasJsErrorSelected(form) ? (
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
                  options={selectOptions[fieldNames.ruleMetricName][alertTypes.specificJsError]}
                  onChange={e => {
                    const doCalculateThresholdOnBackend = {
                      name: hiddenFieldNames.calculateThresholdOnBackend,
                      value: true
                    };
                    onChange(form, fieldNames.ruleMetricName, (e && e.value) || '', doCalculateThresholdOnBackend);
                  }}
                  defaultValue={errorCountMetricName}
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
                    const doCalculateThresholdOnBackend = {
                      name: hiddenFieldNames.calculateThresholdOnBackend,
                      value: true
                    };
                    onChange(form, fieldNames.thresholdOperator, (e && e.value) || '', doCalculateThresholdOnBackend);
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
                  value={thresholdValue == null ? '' : percentageMetric ? thresholdValue * 100 : thresholdValue}
                  step="1"
                  onChange={e => {
                    let value = '';
                    if (e.target.value !== '') {
                      value = percentageMetric ? Math.abs(e.target.value) / 100 : Math.abs(e.target.value);
                    }
                    onChange(form, fieldNames.thresholdValue, value);
                  }}
                />
              </FormGroup>
            </div>
          )}
          <div className={locals.placeholder}>
            <JsErrorsAlertingBarChart
              websiteId={form.get(fieldNames.websiteId).value}
              threshold={thresholdValue || 0}
              operator={form.get(fieldNames.thresholdOperator).value}
              timeConfig={timeConfig}
              tagFilters={form.get(fieldNames.tagFilters).value}
              errorFilter={{
                name: 'beacon.error.message',
                operator: form.get(fieldNames.ruleOperator).value,
                stringValue: form.get(fieldNames.ruleValue).value
              }}
              metricName={metricName}
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
