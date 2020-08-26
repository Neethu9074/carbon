import React from 'react';

import {
  timeAggregationOptions,
  metricOptions,
  sumAggregation,
  meanAggregation
} from 'in-custom-dashboards/widgets/Slo/components/metricFormData';
import { PercentageFormInput } from 'in-custom-dashboards/widgets/Slo/components/PercentageFormInput';
import DropDownMock from 'in-custom-dashboards/widgets/Slo/components/DropDownMock';
import InputMock from 'in-custom-dashboards/widgets/Slo/components/InputMock';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Col, Row } from 'in-new-components/layout/Grid';
import KeyValue from 'in-new-components/lists/KeyValue';
import FormGroup from 'in-components/form/FormGroup';
import Header from 'in-components/form/Header';

import locals from 'in-custom-dashboards/widgets/Slo/SliForm.mless';

export const MetricsForm = ({ form, onChange }) => {
  const metricConfiguration = form.get('metricConfiguration');
  if (!metricConfiguration) return false;

  const aggregationValue = metricConfiguration.get('metricAggregation')?.value;
  const metricName = metricConfiguration.get('metricName')?.value;
  const percentThreshold = metricName === 'errors';

  const localOnChange = (path, fn) => {
    onChange(['metricConfiguration', ...path], fn);
  };

  return (
    <>
      <StackItem>
        <Header>Metric & Threshold</Header>
      </StackItem>
      <StackItem>
        <Row>
          <Col md={2}>
            <KeyValue value="Metric" inverted className={locals.oneLineLabel} />
          </Col>
          <Col md={3}>
            <FormGroup withoutBottomMargin>
              <DropDownMock
                options={[{ value: undefined, label: 'Please select' }, ...metricOptions]}
                value={metricName ?? ''}
                onChange={({ target }) =>
                  localOnChange?.(['metricName'], f => f.setValue(target.value).setTouched(true))
                }
              />
              <TouchedMessages field={metricConfiguration.get('metricName')} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <KeyValue value="Aggregation" inverted className={locals.oneLineLabel} />
          </Col>
          <Col md={3}>
            <FormGroup withoutBottomMargin>
              <DropDownMock
                options={getAggregationOptions(metricName ?? 'latency')}
                value={aggregationValue ?? ''}
                onChange={({ target }) =>
                  localOnChange?.(['metricAggregation'], f => f.setValue(target.value).setTouched(true))
                }
              />
              <TouchedMessages field={metricConfiguration.get('metricAggregation')} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={2}>
            <KeyValue
              value={getThresholdLabelWithUnit(metricName ?? 'latency')}
              inverted
              className={locals.oneLineLabel}
            />
          </Col>
          <Col md={3}>
            <FormGroup withoutBottomMargin>
              {percentThreshold && (
                <PercentageFormInput form={metricConfiguration} onChange={localOnChange} fieldName="threshold" />
              )}
              {!percentThreshold && (
                <InputMock form={metricConfiguration} onChange={localOnChange} fieldName="threshold" />
              )}
              <TouchedMessages field={metricConfiguration.get('threshold')} />
            </FormGroup>
          </Col>
        </Row>
      </StackItem>
    </>
  );
};

function getThresholdLabelWithUnit(metricName) {
  if (metricName === 'latency') {
    return 'Threshold (ms)';
  } else if (metricName === 'errors') {
    return 'Threshold (%)';
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
