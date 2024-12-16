/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import ApplicationQueryBuilder from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

import locals from 'in-applications/Forms/shared/ApplicationQueryBuilderInput.mless';

interface ApplicationQueryBuilderInputProps {
  value: FormModelElement[];
  onChange: (tagFilterExpression: FormModelElement[]) => void;
}

export const ApplicationQueryBuilderInput = ({ value, onChange }: ApplicationQueryBuilderInputProps) => {
  return (
    <div className={locals.queryBuilder} id="querybuilder-input">
      <ApplicationQueryBuilder value={value} onChange={onChange} />
    </div>
  );
};
