import React from 'react';

import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import { metricOptions, metricAggregations } from 'in-custom-dashboards/widgets/Slo/components/metricFormData';
import { PercentageFormInput } from 'in-custom-dashboards/widgets/Slo/components/PercentageFormInput';
import FormInputField from 'in-custom-dashboards/widgets/Slo/components/FormInputField';
import FormDropDown from 'in-custom-dashboards/widgets/Slo/components/FormDropDown';
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
  const aggregationData = metricAggregations[metricName];
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
              <FormDropDown
                options={metricOptions}
                value={metricName ?? ''}
                onChange={({ target }) =>
                  onChange([], form => {
                    const newMetricName = target.value;
                    const aggregationData = metricAggregations[newMetricName];
                    return (
                      form
                        .updateIn(['metricConfiguration', 'metricName'], f =>
                          f.setValue(newMetricName).setTouched(true)
                        )
                        .updateIn(['metricConfiguration', 'metricAggregation'], f =>
                          f.setValue(aggregationData.defaultValue).setTouched(true)
                        )
                        // reset threshold value when metric changed, because value for metric A does not have any meaning
                        // for metric B, as well as the format of the threshold could have completely changed
                        .updateIn(['metricConfiguration', 'threshold'], f => f.setValue('').setTouched(false))
                    );
                  })
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
              <FormDropDown
                options={aggregationData.options}
                value={aggregationValue ?? aggregationData.defaultValue}
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
                <>
                  <PercentageFormInput form={metricConfiguration} onChange={localOnChange} fieldName="threshold" />
                  <TouchedMessages field={metricConfiguration.get('threshold')} />
                </>
              )}
              {!percentThreshold && (
                <>
                  <FormInputField form={metricConfiguration} onChange={localOnChange} fieldName="threshold" />
                  <OverridingTextTouchedMessage
                    field={metricConfiguration.get('threshold')}
                    message="The value of threshold must not be invalid or empty."
                  />
                </>
              )}
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
