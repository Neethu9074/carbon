/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { Stack, Checkbox } from '@instana/components';

// @ts-expect-error
import MetricConfiguration from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricConfiguration';
import { formatterPath, metricsPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { getFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import Sections from 'in-components/workspace/Sections/Sections';
import Section from 'in-components/workspace/Section';
import { MetricSource } from 'in-types';
import { datasets } from '../form';
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
        const formatter = metricForm.get('formatter')?.value;
        const metric = metricForm.get('metric')?.value;
        const aggregation = metricForm.get('aggregation')?.value;
        const formatters = getFormatter(source, metric, aggregation);
        const required = metricForm.get('required')?.value ?? false;

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
                      .updateIn([datasets, metricsPath, i, 'formatterSelected'], field =>
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
          />
        );
      })}
    </>
  );
}

export function getShortMetricKey(columnName: string, columnIndex: number) {
  return `${columnName}${columnIndex + 1}`;
}
