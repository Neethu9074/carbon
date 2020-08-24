import React from 'react';

import {
  timeAggregationOptions,
  metricOptions,
  sumAggregation,
  meanAggregation
} from 'in-custom-dashboards/widgets/Slo/components/metricFormData';
import DropDownMock from 'in-custom-dashboards/widgets/Slo/components/DropDownMock';
import InputMock from 'in-custom-dashboards/widgets/Slo/components/InputMock';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Header from 'in-components/form/Header';
import Label from 'in-components/form/Label';

export const MetricsForm = ({ form, onChange }) => {
  const metricConfiguration = form.get('metricConfiguration');
  if (!metricConfiguration) return false;

  const aggregationValue = metricConfiguration?.get('metricAggregation')?.value;
  const metricName = metricConfiguration?.get('metricName')?.value;

  const localOnChange = (path, fn) => {
    onChange(['metricConfiguration', ...path], fn);
  };

  return (
    <StackItem>
      <Header>Metric & Threshold</Header>
      <FormGroup>
        <Label>Metric</Label>
        <DropDownMock
          options={[{ value: undefined, label: 'Please select' }, ...metricOptions]}
          value={metricName ?? ''}
          onChange={({ target }) => localOnChange?.(['metricName'], f => f.setValue(target.value).setTouched(true))}
        />
        <TouchedMessages field={metricConfiguration?.get('metricAggregation')} />
      </FormGroup>
      <FormGroup>
        <Label>Aggregation</Label>
        <DropDownMock
          options={getAggregationOptions(metricName ?? 'latency')}
          value={aggregationValue ?? ''}
          onChange={({ target }) =>
            localOnChange?.(['metricAggregation'], f => f.setValue(target.value).setTouched(true))
          }
        />
        <TouchedMessages field={metricConfiguration?.get('metricName')} />
      </FormGroup>
      <FormGroup>
        <Label>{getThresholdLabelWithUnit(metricName ?? 'latency')}</Label>
        <InputMock form={metricConfiguration} onChange={localOnChange} fieldName="threshold" />
        <TouchedMessages field={metricConfiguration?.get('threshold')} />
      </FormGroup>
    </StackItem>
  );
};

function getThresholdLabelWithUnit(metricName) {
  if (metricName === 'latency') {
    return 'Threshold (ms)';
  } else if (metricName === 'errors') {
    return 'Threshold (percentage)';
  }
  return 'Threshold (count)';
}

function getAggregationOptions(metricName) {
  if (metricName === 'latency') {
    return timeAggregationOptions;
  } else if (metricName === 'errors') {
    return meanAggregation;
  }
  return sumAggregation;
}
