/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { FormLabel, Li, Ul } from '@instana/components';

import ApplicationQueryBuilder from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';

import locals from 'in-applications/Forms/shared/ApplicationQueryBuilderInput.mless';

interface ApplicationQueryBuilderInputProps {
  label: string;
  value: FormModelElement[];
  onChange: (tagFilterExpression: FormModelElement[]) => void;
}

export const ApplicationQueryBuilderInput = ({ label, value, onChange }: ApplicationQueryBuilderInputProps) => {
  return (
    <>
      <FormLabel>{label}</FormLabel>
      <Ul>
        <Li>
          <div className={locals.queryBuilder}>
            <ApplicationQueryBuilder value={value} onChange={onChange} />
          </div>
        </Li>
      </Ul>
    </>
  );
};
