/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';

import { PolicyForm, PolicyFormOnChange } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/types';
import { PolicyDialogMode } from 'in-automation/types';
import { PolicyFormSideEffectsReturnType } from 'in-automation/Policies/CreatePolicyTearsheet/hooks/usePolicyFormSideEffects';

interface PolicyFormContextProps {
  form: PolicyForm;
  mode: PolicyDialogMode;
  onChange: PolicyFormOnChange;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
  updateForm: PolicyFormSideEffectsReturnType;
}

const PolicyFormContext = React.createContext<PolicyFormContextProps | undefined>(undefined);

export default PolicyFormContext;


export function usePolicyFormContext() {
  const context = useContext(PolicyFormContext);

  if (context === undefined) {
    throw new Error('Must be used inside PolicyForm');
  }

  return context;
}
