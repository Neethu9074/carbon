/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import {
  aggregationPath,
  formatterPath,
  metricConfigurationPath,
  metricPath,
  sourcePath,
  useFormatterFormSideEffects
} from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import sources from '../_shared/MetricConfigurator/sources';
import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import TimeShiftingForm from 'in-custom-dashboards/widgets/BigNumber/TimeShiftingForm';
import { getFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';
import { defaultFormatter } from 'in-stores/metric/formatters';

export default function BigNumberWidgetFormComponent({ form, onChange }) {
  const metricConfig = form.get(metricConfigurationPath);
  const sourceField = metricConfig.get(sourcePath);
  const metricField = metricConfig.get(metricPath);
  const aggregationField = metricConfig.get(aggregationPath);

  const source = sourceField.value;
  const metric = metricField.value;
  const aggregation = aggregationField.value;
  const formatters = getFormatter(source, metric, aggregation);

  const updateForm = useFormatterFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
  });

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
              updateForm(form
                .updateIn([metricConfigurationPath], () => metricConfigurationForm)
                .updateIn([formatterPath], field => field.setValue(sources[newSource]?.defaultFormatterId ?? defaultFormatter.id))),
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
                updateForm(form.updateIn([formatterPath], field => field.setValue(e.target.value).setTouched(true)))
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
        timeShiftConfiguration={<TimeShiftingForm form={form} onChange={onChange} />}
      />
    </Stack>
  );
}
