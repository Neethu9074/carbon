/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import { t } from '@instana/i18n-react';

import {
  entityType,
  grouping,
  metricLabel,
  datasets,
  metric as metricFieldName,
  tagFilterExpression
} from 'in-custom-dashboards/widgets/Table/infrastructure/form';
import IndeterminateLoadingIndicator from 'in-components/LoadingIndicators/IndeterminateLoadingIndicator';
import { metricsPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import Section from 'in-components/workspace/Section/Section';

import locals from 'in-components/GroupingConfigurator/LoadingIndicator.mless';

interface EntityItem {
  type: string;
  label: string;
  count: number;
}

interface EntityInfraTypeSelectorProps {
  setTagFilterExpression: React.Dispatch<React.SetStateAction<FormModelElement[]>>;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  entityItems: EntityItem[];
}

export default function EntityInfraTypeSelector({
  form,
  updateForm,
  setTagFilterExpression,
  entityItems
}: EntityInfraTypeSelectorProps) {
  const metricsForm = form.get(datasets).get(metricsPath);
  const metricsFormSize = metricsForm.size;

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // Update metrics fields and clear values in case entity type has changed
    if (metricsFormSize > 0) {
      let updatedForm = updateMetricsFields(form, metricsFormSize, metricFieldName, '');

      updatedForm = updateMetricsFields(updatedForm, metricsFormSize, metricLabel, '');
      updatedForm = updateMetricsFields(updatedForm, metricsFormSize, 'type', event.target.value);

      updateEntityInfraType(updatedForm, event.target.value, updateForm);
    } else {
      updateEntityInfraType(form, event.target.value, updateForm);
    }

    setTagFilterExpression([]);
  };

  const entityTypeField = form.get(entityType);
  const entityLabel = t('in-custom-dashboards:widgets.table.form.infrastructure.entityType');

  if (!entityItems) {
    return (
      <Section titleHtmlFor={entityType} title={entityLabel}>
        <div className={locals.wrapper}>
          <IndeterminateLoadingIndicator size={27} />
          <span className={locals.text}>
            {t('in-custom-dashboards:widgets.table.form.infrastructure.loadingEntities')}
          </span>
        </div>
      </Section>
    );
  }

  return entityTypeField?.map((field: Field<string>) => (
    <SelectInSection
      id={entityType}
      label={entityLabel}
      value={field.value}
      disabled={!entityItems}
      hasError={!field.valid && field.touched}
      onChange={onChange}
      additionalContent={<TouchedMessages field={entityTypeField} />}
    >
      <option value="">{t('in-custom-dashboards:widgets.table.form.pleaseSelect')}</option>
      {entityItems?.map(({ id, type, label }: any, index: number) => (
        <option key={`${id}-${index}`} value={type}>
          {label}
        </option>
      ))}
    </SelectInSection>
  ));
}

export function updateMetricsFields(
  form: MapForm<any>,
  metricsFormSize: number,
  fieldToUpdate: string,
  newValue: string
) {
  let updatedForm = form;

  for (let i = 0; i < metricsFormSize; i++) {
    // @ts-expect-error
    updatedForm = updatedForm.updateIn([datasets, metricsPath, `${i}`, fieldToUpdate], (field: Item) =>
      (field as Field<string>).setValue(newValue).setTouched(true)
    );
  }

  return updatedForm;
}

function updateEntityInfraType(form: MapForm<any>, newEntityValue: string, updateForm: (form: MapForm<any>) => void) {
  updateForm(
    form
      .updateIn([tagFilterExpression], (field: Item) => (field as Field<string[]>).setValue([]).setTouched(true))
      .updateIn([grouping], (field: Item) => (field as Field<string[]>).setValue([]).setTouched(true))
      .updateIn([entityType], (field: Item) => (field as Field<string>).setValue(newEntityValue).setTouched(true))
  );
}
