/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field } from 'formalistic';
import React from 'react';

import ApplicationQueryBuilder from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { role } from 'in-stores/user';

import locals from 'in-applications/Forms/shared/ApplicationQueryBuilderInput.mless';

interface ApplicationQueryBuilderInputProps {
  formField: Field<FormModelElement[]>;
  onChange: (tagFilterExpression: FormModelElement[]) => void;
}

export const ApplicationQueryBuilderInput = ({ formField, onChange }: ApplicationQueryBuilderInputProps) => {
  return (
    <div className={locals.queryBuilder} id="querybuilder-input">
      <ApplicationQueryBuilder value={formField.value} onChange={onChange} readOnly={!role?.canConfigureSubtraces} />
    </div>
  );
};
