/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { Stack } from '@instana/components';

import {
  aggregationPath,
  formatterPath,
  metricConfigurationPath,
  metricPath,
  sourcePath,
  useFormatterFormSideEffects
} from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import TimeShiftingForm from 'in-custom-dashboards/widgets/BigNumber/TimeShiftingForm';
import sources from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources';
import ThresholdForm from 'in-custom-dashboards/widgets/BigNumber/ThresholdForm';
import { getFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import { thresholdCustomDashboardsEnabled } from 'in-services/featureFlags';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { defaultFormatter } from 'in-stores/metric/formatters';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export default function BigNumberWidgetFormComponent({ form, onChange }) {
  const metricConfig = form.get(metricConfigurationPath);
  const sourceField = metricConfig.get(sourcePath);
  const metricField = metricConfig.get(metricPath);
  const aggregationField = metricConfig.get(aggregationPath);

  const source = sourceField.value;
  const metric = metricField.value;
  const aggregation = aggregationField.value;
  const formatters = getFormatter(source, metric, aggregation);
  const isFormatterSelected = form.get('formatterSelected')?.value;
  const metricFormatter = metricConfig.get(formatterPath)?.value;

  const updateForm = useFormatterFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
  });

  useEffect(
    () => {
      if (isFormatterSelected || !metricFormatter) {
        return;
      }

      updateForm(
        form
          .updateIn([formatterPath], field => field.setValue(metricFormatter).setTouched(true))
          .updateIn(['formatterSelected'], field => field.setValue(false).setTouched(true))
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metricFormatter, isFormatterSelected]
  );

  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.bigNumber.formComponent.whatULikeShow')}</Header>

      <MetricConfigurator
        form={metricConfig}
        onChange={(path, fn) => {
          updateForm(form.updateIn([metricConfigurationPath, ...path], fn));
        }}
        onChangeSource={newSource =>
          onChangeSource(
            metricConfig,
            metricConfigurationForm =>
              updateForm(
                form
                  .updateIn([metricConfigurationPath], () => metricConfigurationForm)
                  .updateIn([formatterPath], field =>
                    field.setValue(sources[newSource]?.defaultFormatterId ?? defaultFormatter.id)
                  )
              ),
            newSource
          )
        }
        formatterSection={form.get(formatterPath).map(field => {
          return (
            <SelectInSection
              id="big-number-formatter"
              label={t('in-custom-dashboards:widgets.bigNumber.formComponent.formatter')}
              value={field.value}
              onChange={e =>
                updateForm(
                  form
                    .updateIn([formatterPath], field => field.setValue(e.target.value).setTouched(true))
                    .updateIn(['formatterSelected'], field => field.setValue(true).setTouched(true))
                )
              }
              hasError={!field.valid && field.touched}
              additionalContent={<TouchedMessages field={field} />}
            >
              {formatters.map(({ id, label }, index) => (
                <option key={`${id}-${index}`} value={id}>
                  {label}
                </option>
              ))}
            </SelectInSection>
          );
        })}
        withGrouping={false}
        withLastValue
        timeShiftConfiguration={<TimeShiftingForm form={form} onChange={onChange} />}
        thresholdConfiguration={
          thresholdCustomDashboardsEnabled && <ThresholdForm form={form} onChange={onChange} updateForm={updateForm} />
        }
      />
    </Stack>
  );
}
