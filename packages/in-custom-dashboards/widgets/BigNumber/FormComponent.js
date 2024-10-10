/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { Stack } from '@instana/components';

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
import { thresholdCustomDashboardsEnabled, unitForInfraMetricsEnabled } from 'in-services/featureFlags';
import { onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import ThresholdForm from 'in-custom-dashboards/widgets/_shared/Threshold/ThresholdForm';
import TimeShiftingForm from 'in-custom-dashboards/widgets/BigNumber/TimeShiftingForm';
import sources from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources';
import { defaultFormatter, getFormatterById } from 'in-stores/metric/formatters';
import useSubForm from 'in-custom-dashboards/widgets/_shared/useSubForm';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { getBaseUnit } from 'in-stores/metric/units';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export default function BigNumberWidgetFormComponent({ form, onChange }) {
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

  const metricFormatter = baseUnit
    ? getCommonFormatterForUnits(baseUnit)?.[0]?.id
    : metricConfig.get(formatterPath)?.value;

  //backward compatibility, adding selected formatter to the list of available formatters
  if (isFormatterSelected) {
    const selectedFormatter = form.get(formatterPath)?.value;
    if (selectedFormatter && !formatters.find(formatter => formatter.id === selectedFormatter)) {
      formatters.push(getFormatterById(selectedFormatter));
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

      updateForm(
        form
          .updateIn([formatterPath], field => field.setValue(metricFormatter).setTouched(true))
          .updateIn([formatterSelectedPath], field => field.setValue(false).setTouched(true))
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [metricFormatter, isFormatterSelected, baseUnit]
  );

  const { form: thresholdForm, update: updateThresholdForm } = useSubForm({
    form,
    path: [metricConfigurationPath, 'threshold'],
    updateForm
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
          thresholdCustomDashboardsEnabled && (
            <ThresholdForm form={thresholdForm} updateForm={updateThresholdForm} formatter={metricFormatter} />
          )
        }
        withUnit
      />
    </Stack>
  );
}
