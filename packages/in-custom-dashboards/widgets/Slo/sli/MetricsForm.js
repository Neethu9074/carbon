/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import { metricOptions, metricAggregations } from 'in-custom-dashboards/widgets/Slo/sli/metricFormData';
import PercentageFormInput from 'in-custom-dashboards/widgets/Slo/components/PercentageFormInput';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-new-components/workspace/Sections';
import Divider from 'in-new-components/workspace/Divider';
import Section from 'in-new-components/workspace/Section';
import Header from 'in-new-components/workspace/Header';
import Input from 'in-components/form/Input/Input';
import Stack from 'in-new-components/layout/Stack';

export const MetricsForm = ({ form, onChange }) => {
  const metricConfiguration = form.get('metricConfiguration');
  if (!metricConfiguration) return null;

  const aggregationValue = metricConfiguration.get('metricAggregation')?.value;
  const metricName = metricConfiguration.get('metricName')?.value;
  const aggregationData = metricAggregations[metricName];
  const percentThreshold = metricName === 'errors';

  const localOnChange = (path, fn) => {
    onChange(['metricConfiguration', ...path], fn);
  };

  return (
    <>
      <Divider />

      <Stack space="normal">
        <Header>Metric & Threshold</Header>

        <Stack space="xsmall">
          {metricConfiguration.get('metricName').map(field => (
            <Sections>
              <SelectInSection
                label="Metric"
                id="new-sli-metric"
                value={field.value ?? ''}
                hasError={!field.valid && field.touched}
                additionalContent={<TouchedMessages field={field} />}
                onChange={e =>
                  onChange([], form => {
                    const newMetricName = e.target.value;
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
              >
                {metricOptions.map(({ label, value }) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </SelectInSection>
            </Sections>
          ))}

          {metricConfiguration.get('metricAggregation').map(field => (
            <Sections>
              <SelectInSection
                label="Aggregation"
                id="new-sli-aggregation"
                value={aggregationValue ?? aggregationData.defaultValue}
                hasError={!field.valid && field.touched}
                additionalContent={<TouchedMessages field={field} />}
                onChange={({ target }) =>
                  localOnChange?.(['metricAggregation'], f => f.setValue(target.value).setTouched(true))
                }
              >
                {aggregationData.options.map(({ label, value }) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </SelectInSection>
            </Sections>
          ))}

          {metricConfiguration.get('threshold').map(field => (
            <Sections>
              <Section
                title={getThresholdLabelWithUnit(metricName ?? 'latency')}
                titleHtmlFor="new-sli-metric-threshold"
              >
                {percentThreshold && (
                  <>
                    <PercentageFormInput
                      id="new-sli-metric-threshold"
                      form={metricConfiguration}
                      onChange={localOnChange}
                      fieldName="threshold"
                    />
                    <TouchedMessages field={field} />
                  </>
                )}

                {!percentThreshold && (
                  <>
                    <Input
                      id="new-sli-metric-threshold"
                      type="number"
                      value={field.value}
                      onChange={e => localOnChange(['threshold'], f => f.setValue(e.target.value).setTouched(true))}
                      hasError={!field.valid && field.touched}
                    />
                    <OverridingTextTouchedMessage
                      field={field}
                      message="The value of threshold must not be invalid or empty."
                    />
                  </>
                )}
              </Section>
            </Sections>
          ))}
        </Stack>
      </Stack>
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
