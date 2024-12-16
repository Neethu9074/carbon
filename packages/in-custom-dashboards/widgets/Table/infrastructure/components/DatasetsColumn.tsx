/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { Stack, Checkbox } from '@instana/components';

import {
  aggregationPath,
  formatterPath,
  formatterSelectedPath,
  metricPath,
  metricsPath,
  unitPath
} from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
// @ts-expect-error
import MetricConfiguration from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricConfiguration';
import { thresholdCustomDashboardsTableWidgetEnabled, unitForInfraMetricsEnabled } from 'in-services/featureFlags';
import { datasets } from 'in-custom-dashboards/widgets/Table/infrastructure/form';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { getFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import Sections from 'in-components/workspace/Sections/Sections';
import { getFormatterById } from 'in-stores/metric/formatters';
import Section from 'in-components/workspace/Section';
import { getBaseUnit } from 'in-stores/metric/units';
import { MetricSource } from 'in-types';
import { t } from 'in-i18n';

interface DatasetsColumnProps {
  form: MapForm<any>;
  metricsForm: Field<string>[];
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  updateForm: (form: MapForm<any>) => void;
  startNumber: number;
  entityType: string;
  source: MetricSource;
}

export default function DatasetsColumn({
  form,
  metricsForm,
  onChange,
  updateForm,
  startNumber,
  entityType,
  source
}: DatasetsColumnProps) {
  return (
    <>
      {metricsForm.map((metricForm: any, i: number) => {
        const formatter = metricForm.get(formatterPath)?.value;
        const metric = metricForm.get(metricPath)?.value;
        const aggregation = metricForm.get(aggregationPath)?.value;
        const unit = unitForInfraMetricsEnabled ? metricForm.get(unitPath)?.value : undefined;
        const formatters = getFormatter(source, metric, aggregation, getBaseUnit(unit));
        const required = metricForm.get('required')?.value ?? false;

        // Backward compatibility, add existing formatter to list of available formatters
        const formatterSelected = metricForm.get(formatterSelectedPath)?.value;
        if (formatterSelected) {
          const selectedFormatter = getFormatterById(formatter);
          if (
            selectedFormatter &&
            !formatters.find(existingFormatter => existingFormatter.id === selectedFormatter.id)
          ) {
            formatters.push(selectedFormatter);
          }
        }

        return (
          <MetricConfiguration
            key={i}
            index={startNumber + i}
            indexInAxis={i}
            metricForm={metricForm}
            onChange={onChange}
            axisName={datasets}
            form={form}
            type={entityType}
            dataSource={source}
            withFiltering={false}
            withGrouping={false}
            withTimeShift={false}
            isTypePrefilled
            getShortMetricKey={(_: string, index: number) => getShortMetricKey('C', index)}
            formatterSection={
              <SelectInSection
                id="metric-formatter"
                label={t('in-custom-dashboards:widgets.table.form.infrastructure.formatter')}
                value={formatter}
                disabled={!metric}
                onChange={e =>
                  updateForm(
                    form
                      // @ts-ignore-error
                      .updateIn([datasets, metricsPath, i, formatterPath], field =>
                        // @ts-ignore-error
                        field.setValue(e.target.value).setTouched(true)
                      )
                      // @ts-ignore-error
                      .updateIn([datasets, metricsPath, i, formatterSelectedPath], field =>
                        // @ts-ignore-error
                        field.setValue(true).setTouched(true)
                      )
                  )
                }
                hasError={!metricForm.valid && metricForm.touched}
                additionalContent={<TouchedMessages field={metricForm} />}
              >
                {formatters.map(({ id, label }, index: number) => (
                  <option key={`${id}-${index}`} value={id}>
                    {label}
                  </option>
                ))}
              </SelectInSection>
            }
            withLastValue
            withEmptyValueFilterSection={
              <Sections>
                <Section title={t('in-custom-dashboards:widgets.table.form.infrastructure.filterEmptyValues')}>
                  <Stack direction="horizontal" align="center" distribution="stretch" gap="large">
                    <Checkbox
                      checked={required}
                      onChange={({ target }) =>
                        updateForm(
                          // @ts-ignore-error
                          form.updateIn([datasets, metricsPath, i, 'required'], field =>
                            // @ts-ignore-error
                            field.setValue(target.checked).setTouched(true)
                          )
                        )
                      }
                      size="large"
                    />
                  </Stack>
                </Section>
              </Sections>
            }
            withUnit
            withThreshold={thresholdCustomDashboardsTableWidgetEnabled}
          />
        );
      })}
    </>
  );
}

export function getShortMetricKey(columnName: string, columnIndex: number) {
  return `${columnName}${columnIndex + 1}`;
}
