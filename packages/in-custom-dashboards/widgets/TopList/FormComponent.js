/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import {
  aggregationPath,
  formatterPath,
  metricConfigurationPath,
  metricPath,
  sourcePath,
  useFormatterFormSideEffects
} from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { source as logs } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/logging';
import { source as event } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event';
import { source as sli } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli';
import { onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { getFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export default function ListWidgetFormComponent({ form, onChange }) {
  const metricConfig = form.get(metricConfigurationPath);
  const sourceField = metricConfig.get(sourcePath);
  const metricField = metricConfig.get(metricPath);
  const aggregationField = metricConfig.get(aggregationPath);

  const source = sourceField.value;
  const metric = metricField.value;
  const aggregation = aggregationField.value;
  const formatters = getFormatter(source, metric, aggregation);

  const isFormatterSelected = form.get('formatterSelected')?.value;
  const formatter = form.get('formatter')?.value;
  const metricFormatter = metricConfig.get(formatterPath)?.value;

  const updateForm = useFormatterFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
  });

  useEffect(
    () => {
      if (isFormatterSelected || !metricFormatter) {
        return;
      }

      const formatterValue = isFormatterSelected === undefined ? formatter : metricFormatter;

      updateForm(
        form
          .updateIn([formatterPath], field => field.setValue(formatterValue).setTouched(true))
          .updateIn(['formatterSelected'], field => field.setValue(false).setTouched(true))
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metricFormatter]
  );

  return (
    <>
      <Header>{t('in-custom-dashboards:widgets.topList.formComp.whatULikeShow')}</Header>
      <MetricConfigurator
        form={metricConfig}
        onChange={(path, fn) => {
          updateForm(form.updateIn([metricConfigurationPath, ...path], fn));
        }}
        onChangeSource={newSource =>
          onChangeSource(
            metricConfig,
            metricConfigurationForm =>
              updateForm(form.updateIn([metricConfigurationPath], () => metricConfigurationForm)),
            newSource
          )
        }
        formatterSection={form.get(formatterPath).map(field => {
          return (
            <SelectInSection
              id="big-number-formatter"
              label={t('in-custom-dashboards:widgets.topList.formComp.formatter')}
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
              useAlternateBg
            >
              {formatters.map(({ id, label }, index) => (
                <option key={`${id}-${index}`} value={id}>
                  {label}
                </option>
              ))}
            </SelectInSection>
          );
        })}
        disabledDataSources={[event, sli, logs]}
        maxGrouping={50}
        withLastValue
      />
    </>
  );
}
