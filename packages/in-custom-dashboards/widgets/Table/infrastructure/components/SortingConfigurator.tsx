/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Order } from '@instana/types';

import { Metric } from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableConfigurator/TableConfigurator';
import { sorting as sortingFieldName } from 'in-custom-dashboards/widgets/Table/infrastructure/form';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { t } from 'in-i18n';

interface SortingConfiguratorProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  sortingOptions: Metric[];
}

export default function SortingConfigurator({ form, updateForm, sortingOptions }: SortingConfiguratorProps) {
  const sortingField = form.get(sortingFieldName);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateForm(
      form.updateIn([sortingFieldName], (field: Field<Order>) =>
        field
          .setValue({
            direction: event.target.value === 'label' ? 'ASC' : 'DESC',
            by: event.target.value
          })
          .setTouched(true)
      )
    );
  };

  const sortingLabel = t('in-custom-dashboards:widgets.table.form.infrastructure.defaultSorting');

  return sortingField?.map((field: Field<Order>) => (
    <SelectInSection
      id={sortingFieldName}
      label={sortingLabel}
      value={field.value.by}
      hasError={!field.valid && field.touched}
      onChange={onChange}
    >
      {sortingOptions?.map(({ value, label }: Metric) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </SelectInSection>
  ));
}
