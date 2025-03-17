/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import {
  aggregationPath,
  formatterPath,
  formatterSelectedPath,
  metricConfigurationPath,
  metricPath,
  sourcePath,
  unitPath,
  useFormatterFormSideEffects
} from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { getCommonFormatterForUnits, getFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import { source as logs } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/logging';
import { source as event } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event';
import { source as sli } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli';
import { onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { unitForInfraMetricsEnabled } from 'in-services/featureFlags';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { getFormatterById } from 'in-stores/metric/formatters';
import { getBaseUnit } from 'in-stores/metric/units';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export default function ListWidgetFormComponent({ form, onChange }) {
  const metricConfig = form.get(metricConfigurationPath);
  const sourceField = metricConfig.get(sourcePath);
  const metricField = metricConfig.get(metricPath);
  const aggregationField = metricConfig.get(aggregationPath);
  const unitField = metricConfig.get(unitPath);

  const source = sourceField.value;
  const metric = metricField.value;
  const aggregation = aggregationField.value;
  const baseUnit = unitForInfraMetricsEnabled ? getBaseUnit(unitField?.value) : undefined;
  const formatters = getFormatter(source, metric, aggregation, baseUnit);

  const isFormatterSelected = form.get(formatterSelectedPath)?.value;
  const formatter = baseUnit ? getCommonFormatterForUnits(baseUnit)[0]?.id : form.get(formatterPath)?.value;
  const metricFormatter = metricConfig.get(formatterPath)?.value;

  //Backward compatibility, add existing formatter to list of available formatters
  if (isFormatterSelected) {
    const selectedFormatter = getFormatterById(form.get(formatterPath)?.value);
    if (selectedFormatter && !formatters.find(existingFormatter => existingFormatter.id === selectedFormatter.id)) {
      formatters.push(selectedFormatter);
    }
  }

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
          .updateIn([formatterSelectedPath], field => field.setValue(false).setTouched(true))
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metricFormatter]
  );

  const disabledDataSources = [event, sli, logs];

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
        disabledDataSources={disabledDataSources}
        maxGrouping={50}
        withLastValue
        withUnit
      />
    </>
  );
}
