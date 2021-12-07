/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import {
  getMetricOptions,
  MetricEntityType,
  MetricOption,
  MetricType
} from 'in-custom-dashboards/widgets/Slo/sli/metricFormData';
import { OverridingFieldValidationMessage } from 'in-custom-dashboards/widgets/Slo/components/OverridingFieldValidationMessage';
import PercentageInput from 'in-custom-dashboards/widgets/Slo/components/PercentageInput';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-components/workspace/Sections';
import Divider from 'in-components/workspace/Divider';
import Section from 'in-components/workspace/Section';
import Header from 'in-components/workspace/Header';
import Input from 'in-components/form/Input/Input';
import { t } from 'in-i18n';

interface MetricsFormProps<S extends MonitoringSource, E extends MetricEntityType<S>> {
  entityType: S;
  metricEntityType: E;
  form: MapForm;
  onChange: (path: string[], updater: (i: Item) => Item) => void;
}

export function MetricsForm<S extends MonitoringSource, E extends MetricEntityType<S>>({
  entityType,
  metricEntityType,
  form,
  onChange
}: MetricsFormProps<S, E>) {
  const metricConfiguration = form.get('metricConfiguration') as MapForm;
  if (!metricConfiguration) return null;

  const metricOptions = getMetricOptions(entityType, metricEntityType);

  const metricAggregationField = metricConfiguration.get('metricAggregation') as Field<string>;
  const metricNameField = metricConfiguration.get('metricName') as Field<MetricType<S, E>>;
  const thresholdField = metricConfiguration.get('threshold') as Field<number | undefined>;

  const aggregationValue = metricAggregationField?.value;
  const metricName = metricNameField?.value;
  const metricOption = metricOptions[metricName];
  const percentThreshold = metricName === 'errors';

  const localOnChange = (path: string[], fn: (i: Item) => Item) => {
    onChange(['metricConfiguration', ...path], fn);
  };

  return (
    <>
      <Divider />

      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.slo.metricsForm.metricThreshold')}</Header>

        <Stack gap="xsmall">
          <Sections>
            <SelectInSection
              label={t('in-custom-dashboards:widgets.slo.metricsForm.metric')}
              id="new-sli-metric"
              value={(metricName as string) ?? ''}
              hasError={!metricNameField.valid && metricNameField.touched}
              additionalContent={<TouchedMessages field={metricNameField} />}
              onChange={e => {
                localOnChange(['metricName'], f => {
                  const newMetricName = e.target.value as MetricType<S, MetricEntityType<S>>;
                  return (f as typeof metricNameField).setValue(newMetricName).setTouched(true);
                });
              }}
            >
              {Object.values<MetricOption<S, E>>(metricOptions).map(({ label, name }) => (
                <option value={name as string} key={name as string}>
                  {label}
                </option>
              ))}
            </SelectInSection>
          </Sections>

          <Sections>
            <SelectInSection
              label={t('in-custom-dashboards:widgets.slo.metricsForm.aggregation')}
              id="new-sli-aggregation"
              value={aggregationValue ?? metricOption.defaultValue}
              hasError={!metricAggregationField?.valid && metricAggregationField?.touched}
              additionalContent={<TouchedMessages field={metricAggregationField} />}
              onChange={({ target }) =>
                localOnChange(['metricAggregation'], f =>
                  (f as typeof metricAggregationField).setValue(target.value).setTouched(true)
                )
              }
            >
              {metricOption?.options.map(({ label, value }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </SelectInSection>
          </Sections>

          <Sections>
            <Section title={metricOption.unitLabel} titleHtmlFor="new-sli-metric-threshold">
              {percentThreshold && (
                <>
                  <PercentageInput
                    id="new-sli-metric-threshold"
                    value={thresholdField?.value}
                    onChange={value =>
                      localOnChange(['threshold'], f => (f as typeof thresholdField).setValue(value).setTouched(true))
                    }
                    hasError={!thresholdField?.valid && thresholdField?.touched}
                  />
                  <TouchedMessages field={thresholdField} />
                </>
              )}

              {!percentThreshold && (
                <>
                  <Input
                    id="new-sli-metric-threshold"
                    type="number"
                    min="0"
                    value={thresholdField?.value}
                    onChange={e => {
                      let newValue: number | undefined = undefined;
                      if (!Number.isNaN(e.target.value)) {
                        newValue = e.target.valueAsNumber;
                      }
                      localOnChange(['threshold'], f =>
                        (f as typeof thresholdField).setValue(newValue).setTouched(true)
                      );
                    }}
                    hasError={!thresholdField?.valid && thresholdField?.touched}
                  />
                  <OverridingFieldValidationMessage
                    field={thresholdField}
                    message={t('in-custom-dashboards:widgets.slo.metricsForm.valThresholdNotInvalidEmpty')}
                  />
                </>
              )}
            </Section>
          </Sections>
        </Stack>
      </Stack>
    </>
  );
}
