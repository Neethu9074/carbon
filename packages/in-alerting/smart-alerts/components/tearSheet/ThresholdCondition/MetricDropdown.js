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
import { t } from 'in-i18n';

export default function MetricDropdown({ alertType, updateForm, form, blueprintConfig }) {
  const metricName = form.get('rule').get('metricName').value;
  if (alertType === 'errors') {
    return (
      <Select
        value={metricName}
        id="metric-selector"
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
        id="metric-selector"
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
        id="metric-selector"
        items={getAggregationOptions(form)}
        onChange={e => {
          updateForm(form.updateIn(['rule', 'aggregation'], f => f.setValue(e.target.value).setTouched(true)));
        }}
      >
        {getAggregationOptions(form).map(items => {
          return (
            <option key={items.value} value={items.value}>
              {getMetricLabelValue(items.label)}
            </option>
          );
        })}
      </Select>
    );
  } else if (alertType === 'throughput') {
    return <ThresholdLabel>{blueprintConfig.getMetricLabel(metricName)}</ThresholdLabel>;
  }
}

function getMetricLabelValue(label) {
  if (label === 'min') {
    return t('in-alerting:smartAlerts.applications.tearSheet.threshold.minLatency');
  } else if (label === 'max') {
    return t('in-alerting:smartAlerts.applications.tearSheet.threshold.maxLatency');
  } else if (label === 'mean') {
    return t('in-alerting:smartAlerts.applications.tearSheet.threshold.meanLatency');
  } else if (label === 'sum') {
    return t('in-alerting:smartAlerts.applications.tearSheet.threshold.sumLatency');
  }
  return t('in-alerting:smartAlerts.applications.tearSheet.threshold.metricLabel', { metricLabel: label });
}
