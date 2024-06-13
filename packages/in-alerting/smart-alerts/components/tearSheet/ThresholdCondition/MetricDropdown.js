/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Select } from '@instana/components';

import { getAggregationValue } from 'in-alerting/smart-alerts/applications/dialog/advanced/thresholdConditionUtil';
import { getAggregationOptions } from 'in-alerting/smart-alerts/components/dialog/form/ruleForm';
import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/applications/form/ruleFormData';
import ThresholdLabel from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdLabel';

export default function MetricDropdown({ alertType, updateForm, form, blueprintConfig }) {
  const metricName = form.get('rule').get('metricName').value;
  if (alertType === 'errors') {
    return (
      <Select
        value={metricName}
        onChange={e => {
          updateForm(form.updateIn(['rule', 'metricName'], f => f.setValue(e.target.value).setTouched(true)));
        }}
      >
        {ruleMetricNameOptions.errors.map(items => {
          return (
            <option key={items.value} value={items.value}>
              {items.label}
            </option>
          );
        })}
      </Select>
    );
  } else if (alertType === 'logs') {
    return (
      <div>
        <ThresholdLabel>{blueprintConfig.getMetricLabel(metricName)}</ThresholdLabel>
      </div>
    );
  } else if (alertType === 'statusCode') {
    return (
      <Select
        value={metricName}
        items={ruleMetricNameOptions.statusCode}
        onChange={e => {
          updateForm(form.updateIn(['rule', 'metricName'], f => f.setValue(e.target.value).setTouched(true)));
        }}
      >
        {ruleMetricNameOptions.statusCode.map(items => {
          return (
            <option key={items.value} value={items.value}>
              {items.label}
            </option>
          );
        })}
      </Select>
    );
  } else if (alertType === 'slowness') {
    return (
      <Select
        value={getAggregationValue(form)}
        items={getAggregationOptions(form)}
        onChange={e => {
          updateForm(form.updateIn(['rule', 'aggregation'], f => f.setValue(e.target.value).setTouched(true)));
        }}
      >
        {getAggregationOptions(form).map(items => {
          return (
            <option key={items.value} value={items.value}>
              {items.label}
            </option>
          );
        })}
      </Select>
    );
  } else if (alertType === 'throughput') {
    return <ThresholdLabel>{blueprintConfig.getMetricLabel(metricName)}</ThresholdLabel>;
  }
}
