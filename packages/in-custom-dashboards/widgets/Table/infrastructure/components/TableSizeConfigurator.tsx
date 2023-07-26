/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import SelectInSection from 'in-components/form/Select/SelectInSection';
import { t } from 'in-i18n';

export const tableSizeFieldName = 'tableSize';
export const tableSizes = [5, 10, 20];
export const defaultTableSize = 5;

export interface FormConfig {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

export default function TableSizeConfigurator({ form, updateForm }: FormConfig) {
  const tableSizeField = form.get(tableSizeFieldName);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateForm(
      form.updateIn([tableSizeFieldName], field => field.setValue(Number(event.target.value)).setTouched(true))
    );
  };

  const getTableSizeLabel = (size: number) =>
    t('in-custom-dashboards:widgets.metricConfig.groupingConfig.top', {
      number: size
    });

  const tableSizeConfiguratorlabel = t('in-custom-dashboards:widgets.table.form.infrastructure.tableSize');

  return tableSizeField?.map((field: Field<number>) => (
    <SelectInSection
      id={tableSizeFieldName}
      label={tableSizeConfiguratorlabel}
      value={field.value}
      hasError={!field.valid && field.touched}
      onChange={onChange}
    >
      {tableSizes.map((size: number) => (
        <option key={size} value={size}>
          {getTableSizeLabel(size)}
        </option>
      ))}
    </SelectInSection>
  ));
}
