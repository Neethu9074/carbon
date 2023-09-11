/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, MapForm } from 'formalistic';
import React, { useEffect } from 'react';

import { Order } from '@instana/types';

import { Metric } from 'in-custom-dashboards/widgets/Table/infrastructure/components/TableConfigurator/TableConfigurator';
import { sorting as sortingFieldName } from 'in-custom-dashboards/widgets/Table/infrastructure/form';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { defaultOrder } from 'in-infrastructure/Explore/constants';
import { t } from 'in-i18n';

interface SortingConfiguratorProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  sortingOptions: Metric[];
  hasGroups: boolean;
}

export default function SortingConfigurator({ form, updateForm, sortingOptions, hasGroups }: SortingConfiguratorProps) {
  const sortingField = form.get(sortingFieldName);

  const updateSortingField = (callback?: (fieldValue: Order) => Order) => {
    updateForm(
      form.updateIn([sortingFieldName], (field: Field<Order>) => {
        const updatedValue = callback?.(field.value);
        return field.setValue(updatedValue as Order).setTouched(true);
      })
    );
  };

  // Update the default sort option
  useEffect(() => {
    updateSortingField(() => ({
      ...defaultOrder,
      by: sortingOptions[0].value
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasGroups]);

  const onChangeSortField = (event: React.ChangeEvent<HTMLSelectElement>) =>
    updateSortingField(fieldValue => ({
      ...fieldValue,
      by: event.target.value
    }));

  const onChangeSortDirection = (event: React.ChangeEvent<HTMLSelectElement>) =>
    updateSortingField(
      fieldValue =>
        ({
          ...fieldValue,
          direction: event.target.value
        } as Order)
    );

  const sortBy = t('in-custom-dashboards:widgets.table.form.infrastructure.sortBy');
  const sortDireection = t('in-custom-dashboards:widgets.table.form.infrastructure.sortDirection');
  const directionOptions = ['ASC', 'DESC'];

  return sortingField?.map((field: Field<Order>) => (
    <>
      <SelectInSection
        id={sortingFieldName}
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
        id={sortingFieldName}
        label={`${sortDireection}`}
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
