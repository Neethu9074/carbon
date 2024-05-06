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
  sortingOptions: Metric[];
  updateForm: (form: MapForm<any>) => void;
}

export default function SortingConfigurator({ form, updateForm, sortingOptions }: SortingConfiguratorProps) {
  const sortingField = form.get(sortingFieldName);

  const updateSortingField = (callback?: (fieldValue: Order) => Order) => {
    updateForm(
      form.updateIn([sortingFieldName], (field: Field<Order>) => {
        const updatedValue = callback?.(field.value);
        return field.setValue(updatedValue as Order).setTouched(true);
      })
    );
  };

  const onChangeSortField = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSortingField(fieldValue => ({
      ...fieldValue,
      by: event.target.value
    }));
  };
  const onChangeSortDirection = (event: React.ChangeEvent<HTMLSelectElement>) =>
    updateSortingField(
      fieldValue =>
        ({
          ...fieldValue,
          direction: event.target.value
        } as Order)
    );

  const sortBy = t('in-custom-dashboards:widgets.table.form.infrastructure.sortBy');
  const sortDirection = t('in-custom-dashboards:widgets.table.form.infrastructure.sortDirection');
  const directionOptions = ['ASC', 'DESC'];

  return sortingField?.map((field: Field<Order>) => (
    <>
      <SelectInSection
        id={`${sortingFieldName}By`}
        label={sortBy}
        value={field.value.by}
        hasError={!field.valid && field.touched}
        onChange={onChangeSortField}
      >
        {sortingOptions?.map(({ value, label }: Metric) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </SelectInSection>
      <SelectInSection
        id={`${sortingFieldName}Direction`}
        label={`${sortDirection}`}
        value={field.value.direction}
        hasError={!field.valid && field.touched}
        onChange={onChangeSortDirection}
      >
        {directionOptions?.map(direction => (
          <option key={direction} value={direction}>
            {direction}
          </option>
        ))}
      </SelectInSection>
    </>
  ));
}
