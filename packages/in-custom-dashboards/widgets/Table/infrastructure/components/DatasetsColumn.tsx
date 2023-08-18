/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

// @ts-expect-error
import MetricConfiguration from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricConfiguration';
import { formatterPath, metricsPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { getFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import SelectInSection from 'in-components/form/Select/SelectInSection';
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
            getShortMetricKey={(_: string, index: number) => getShortMetricKey('C', index)}
            formatterSection={
              <SelectInSection
                id="metric-formatter"
                label={t('in-custom-dashboards:widgets.table.form.infrastructure.formatter')}
                value={formatter}
                disabled={!metric}
                onChange={e =>
                  updateForm(
                    // @ts-expect-error
                    form.updateIn([datasets, metricsPath, i, formatterPath], (field: any) =>
                      field.setValue(e.target.value).setTouched(true)
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
          />
        );
      })}
    </>
  );
}

export function getShortMetricKey(columnName: string, columnIndex: number) {
  return `${columnName}${columnIndex + 1}`;
}
