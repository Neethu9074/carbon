/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { QueryBuilderComponent, QueryBuilderProps } from 'in-components/QueryBuilder';

import locals from './FilterConfigurator.mless';

interface FilterConfiguratorProps extends Omit<QueryBuilderProps, 'value' | 'onChange'> {
  QueryBuilderComponent: QueryBuilderComponent;
  form: MapForm;
  updateForm: (f: MapForm) => MapForm;
  formFieldName: string;
}

export default function FilterConfigurator({
  QueryBuilderComponent,
  form,
  updateForm,
  formFieldName,
  ...remainingProps
}: FilterConfiguratorProps) {
  return (
    <div className={locals.querybuilderLayoutWrapper}>
      <QueryBuilderComponent
        {...remainingProps}
        value={(form.get(formFieldName) as Field<FormModelElement[]>)?.value}
        onChange={tfe =>
          updateForm(
            form.updateIn([formFieldName], f => (f as Field<FormModelElement[]>).setValue(tfe).setTouched(true))
          )
        }
      />
    </div>
  );
}
