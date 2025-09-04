/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CreateTearsheetStep } from '@instana/ibm-products';
import { Action } from '@instana/types';

import { usePolicyFormContext } from 'in-automation/Policies/CreatePolicyTearsheet/PolicyFormContext';
import validateFormFields from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/utils';
import SelectAction from 'in-automation/Policies/NewSelectAction';
import { isFieldValid } from 'in-automation/utils/form';

export default function ActionConfigurationStep({ actions }: { actions: Action[] }) {
  const { form } = usePolicyFormContext();
  const actionField = form.get('action');
  const isFormValid = isFieldValid(actionField);
  const validateForm = validateFormFields([['action']]);
  return (
    <CreateTearsheetStep
      key={2}
      hasFieldset={false}
      title="Configure action"
      onNext={validateForm}
      invalid={!isFormValid}
    >
      {actions && <SelectAction actions={actions} />}
    </CreateTearsheetStep>
  );
}
