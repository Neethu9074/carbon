import React from 'react';

import InputMock from 'in-custom-dashboards/widgets/Slo/components/InputMock';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import FormGroup from 'in-components/form/FormGroup';
import Header from 'in-components/form/Header';
import Label from 'in-components/form/Label';

export const MetricsForm = ({ form, onChange }) => {
  const metricConfiguration = form.get('metricConfiguration');
  const localOnChange = (path, fn) => {
    onChange(['metricConfiguration', ...path], fn);
  };
  if (!metricConfiguration) return false;

  return (
    <StackItem>
      <Header>Metric & Threshold</Header>
      <FormGroup>
        <Label>Metric</Label>
        <InputMock form={metricConfiguration} onChange={localOnChange} fieldName="metricName" />
        {
          // TODO check, isn't there a way to get the available list like in MetricsConfigurationSelector...
        }
        <FormGroup>
          <Label>Aggregation</Label>
          <InputMock form={metricConfiguration} onChange={localOnChange} fieldName="metricAggregation" />
        </FormGroup>
        <Label>Threshold</Label>
        <InputMock form={metricConfiguration} onChange={localOnChange} fieldName="threshold" />
      </FormGroup>
    </StackItem>
  );
};
