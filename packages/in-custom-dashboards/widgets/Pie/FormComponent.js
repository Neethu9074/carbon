/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import {
  aggregationPath,
  formatterPath,
  formatterSelectedPath,
  metricPath,
  metricsPath,
  sourcePath,
  unitPath,
  useChartFormatterFormSideEffects,
  y1AxisPath
} from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { MetricsForAxis, Reorderer } from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricReordering';
import DataSeriesConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/DataSeriesConfigurator';
import { getCommonFormatterForUnits, getFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import { getShortMetricKey } from 'in-custom-dashboards/widgets/Pie/util';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { unitForInfraMetricsEnabled } from 'in-services/featureFlags';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { publicFormatters } from 'in-stores/metric/formatters';
import Sections from 'in-components/workspace/Sections';
import Divider from 'in-components/workspace/Divider';
import { getBaseUnit } from 'in-stores/metric/units';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export default function PieChartWidgetFormComponent({ form, onChange }) {
  const axisNames = [y1AxisPath];
  const axis = axisNames.map(axisName => form.get(axisName));

  const metricsForAxis = axis.flatMap(axis => axis.get(metricsPath));
  const metricConfigurations = metricsForAxis?.flatMap(metricList => {
    return [
      ...new Set(
        metricList.map(list => {
          const source = list.get(sourcePath)?.value;
          const metric = list.get(metricPath)?.value;
          const aggregation = list.get(aggregationPath)?.value;
          const baseUnit = unitForInfraMetricsEnabled ? getBaseUnit(list.get(unitPath)?.value) : undefined;

          return {
            source,
            metric,
            aggregation,
            baseUnit
          };
        })
      )
    ];
  });

  let availableFormatters =
    metricConfigurations?.flatMap(config =>
      getFormatter(config.source, config.metric, config.aggregation, config.baseUnit)
    ) ?? [];

  const configuredUnits = metricConfigurations.map(({ baseUnit }) => baseUnit).filter(unit => unit);

  getCommonFormatterForUnits(...configuredUnits).forEach(formatter => {
    if (!availableFormatters.find(existingFormatter => existingFormatter.id === formatter.id)) {
      availableFormatters.push(formatter);
    }
  });

  if (availableFormatters.length === 0) {
    availableFormatters = publicFormatters;
  }

  const updateForm = useChartFormatterFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
  });

  return (
    <Stack gap="large">
      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.pie.formComponent.datasets')}</Header>
        <DataSeriesConfigurator
          form={form}
          onChange={(path, fn) => {
            updateForm(form.updateIn(path, fn));
          }}
          getShortMetricKey={getShortMetricKey}
          withLastValue
          withUnit
        />
      </Stack>

      <Divider />

      <Stack gap="normal">
        <Reorderer form={form} onChange={onChange}>
          <MetricsForAxis
            form={form}
            onChange={onChange}
            axisName="y1"
            startIndex={0}
            getShortMetricKey={getShortMetricKey}
            helpText={t('in-custom-dashboards:widgets.pie.formComponent.dragDropDatasetsReorder')}
            withUnitPill
          />
        </Reorderer>
      </Stack>

      <Divider />

      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.pie.formComponent.dataPresentation')}</Header>

        {form.getIn([y1AxisPath, formatterPath]).map(field => (
          <Sections>
            <SelectInSection
              id={`axis-y1-formatter`}
              label={t('in-custom-dashboards:widgets.pie.formComponent.formatter')}
              value={field.value}
              onChange={e =>
                updateForm(
                  form
                    .updateIn([y1AxisPath, formatterPath], field => field.setValue(e.target.value).setTouched(true))
                    .updateIn([y1AxisPath, formatterSelectedPath], field => field.setValue(true).setTouched(true))
                )
              }
              hasError={!field.valid && field.touched}
              additionalContent={<TouchedMessages field={field} />}
            >
              {availableFormatters.map(({ id, label }, index) => (
                <option key={`${id}-${index}`} value={id}>
                  {label}
                </option>
              ))}
            </SelectInSection>
          </Sections>
        ))}
      </Stack>
    </Stack>
  );
}
