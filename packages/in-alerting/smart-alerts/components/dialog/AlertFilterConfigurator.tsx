/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';

import locals from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator.mless';

interface AlertFilterConfiguratorProps {
  QueryBuilderComponent: QueryBuilderComponent;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}
export default function AlertFilterConfigurator({
  QueryBuilderComponent,
  form,
  updateForm
}: AlertFilterConfiguratorProps) {
  const tagFilterExpression = form.get('tagFilterExpression')?.value;
  // NOTE: Website alert configs does not have builtIn param
  const isBuiltIn = form.get('builtIn')?.value;

  return (
    <div className={locals.queryBuilderWrapper}>
      <span className={locals.queryBuilderPositionCorrection}>
        {
          <QueryBuilderComponent
            onChange={(tfe: FormModelElement[]) => handleChangeTagFilterExpressionChange(tfe, form, updateForm)}
            value={tagFilterExpression}
            readOnly={isBuiltIn}
          />
        }
      </span>
    </div>
  );
}

export const handleChangeTagFilterExpressionChange = (
  tagFilterExpression: FormModelElement[],
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void
) => {
  updateForm(form.updateIn(['tagFilterExpression'], f => f.setValue(tagFilterExpression).setTouched(true)));
};
