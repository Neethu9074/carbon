/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import { OverridingTextTouchedMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingTextTouchedMessage';
import PercentageInput from 'in-custom-dashboards/widgets/Slo/components/PercentageInput';
import { getMetricOptions } from 'in-custom-dashboards/widgets/Slo/sli/metricFormData';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-components/workspace/Sections';
import Divider from 'in-components/workspace/Divider';
import Section from 'in-components/workspace/Section';
import Header from 'in-components/workspace/Header';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

export const MetricsForm = ({ entityType, metricEntityType, form, onChange }) => {
  const metricConfiguration = form.get('metricConfiguration');
  if (!metricConfiguration) return null;

  const metricOptions = getMetricOptions(entityType, metricEntityType);

  const aggregationValue = metricConfiguration.get('metricAggregation')?.value;
  const metricName = metricConfiguration.get('metricName')?.value;
  const metricOption = metricOptions[metricName];
  const percentThreshold = metricName === 'errors';

  const localOnChange = (path, fn) => {
    onChange(['metricConfiguration', ...path], fn);
  };

  return (
    <>
      <Divider />

      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.slo.metricsForm.metricThreshold')}</Header>

        <Stack gap="xsmall">
          {metricConfiguration.get('metricName').map(field => (
            <Sections>
              <SelectInSection
                label={t('in-custom-dashboards:widgets.slo.metricsForm.metric')}
                id="new-sli-metric"
                value={field.value ?? ''}
                hasError={!field.valid && field.touched}
                additionalContent={<TouchedMessages field={field} />}
                onChange={e =>
                  onChange([], form => {
                    const newMetricName = e.target.value;
                    return form.updateIn(['metricConfiguration', 'metricName'], f =>
                      f.setValue(newMetricName).setTouched(true)
                    );
                  })
                }
              >
                {Object.values(metricOptions).map(({ label, name }) => (
                  <option value={name} key={name}>
                    {label}
                  </option>
                ))}
              </SelectInSection>
            </Sections>
          ))}

          {metricConfiguration.get('metricAggregation').map(field => (
            <Sections>
              <SelectInSection
                label={t('in-custom-dashboards:widgets.slo.metricsForm.aggregation')}
                id="new-sli-aggregation"
                value={aggregationValue ?? metricOption.defaultValue}
                hasError={!field.valid && field.touched}
                additionalContent={<TouchedMessages field={field} />}
                onChange={({ target }) =>
                  localOnChange?.(['metricAggregation'], f => f.setValue(target.value).setTouched(true))
                }
              >
                {metricOption?.options.map(({ label, value }) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </SelectInSection>
            </Sections>
          ))}

          {metricConfiguration.get('threshold').map(field => (
            <Sections>
              <Section title={metricOption.unitLabel} titleHtmlFor="new-sli-metric-threshold">
                {percentThreshold && (
                  <>
                    <PercentageInput
                      id="new-sli-metric-threshold"
                      value={field.value}
                      onChange={value => localOnChange(['threshold'], f => f.setValue(value).setTouched(true))}
                      hasError={!field.valid && field.touched}
                    />
                    <TouchedMessages field={field} />
                  </>
                )}

                {!percentThreshold && (
                  <>
                    <Input
                      id="new-sli-metric-threshold"
                      type="number"
                      min="0"
                      value={field.value}
                      onChange={e => localOnChange(['threshold'], f => f.setValue(e.target.value).setTouched(true))}
                      hasError={!field.valid && field.touched}
                    />
                    <OverridingTextTouchedMessage
                      field={field}
                      message={t('in-custom-dashboards:widgets.slo.metricsForm.valThresholdNotInvalidEmpty')}
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
