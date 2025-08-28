/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useEffect, useState } from 'react';

import { Action, Error, Policy } from '@instana/types';

import {
  createPolicyFormDefinition,
  createPolicyFormFromPolicy
} from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/usePolicyFormHelper';
import usePolicyFormSideEffects, {
  PolicyFormSideEffectsReturnType
} from 'in-automation/Policies/CreatePolicyTearsheet/hooks/usePolicyFormSideEffects';
import { PolicyForm } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/types';
import { TriggerDetailsProps } from 'in-automation/AutomationCard/CreatePolicyButton';
import useFormSubmission, { DoSubmitFunction } from 'in-hooks/useFormSubmission';
import { saveNewPolicyNew, savePolicyNew } from 'in-automation/api';
import { PolicyDialogMode, Triggers } from 'in-automation/types';
import { PolicyFormEntity } from 'in-automation/Policies/types';
import { FetchStatus } from 'in-hooks/utils/types';
import { t } from 'in-i18n';

export function createPolicyForm({
  policy,
  actions,
  triggers,
  triggerDetails,
  actionId
}: {
  policy: PolicyFormEntity;
  actions: Action[];
  triggers: Triggers;
  triggerDetails?: TriggerDetailsProps;
  actionId?: string;
}) {
  if (policy) return createPolicyFormFromPolicy(policy, actions, triggers);
  return createPolicyFormDefinition(actions, triggerDetails, actionId);
}

interface usePolicyFormReturn {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
  updateForm: PolicyFormSideEffectsReturnType;
  submitStatus: FetchStatus | undefined;
  doSubmit: DoSubmitFunction<Policy, Policy>;
  resetForm: () => void;
  errors: Error[] | undefined;
}

export default function usePolicyForm(
  mode: PolicyDialogMode,
  policy: PolicyFormEntity,
  actions: Action[],
  triggers: Triggers,
  triggerDetails?: TriggerDetailsProps,
  loading = false,
  actionId?: string
): usePolicyFormReturn {
  const [form, setForm] = useState(createPolicyForm({ policy, actions, triggers, triggerDetails, actionId }));
  const updateForm = usePolicyFormSideEffects(form, setForm);
  const [submitStatus, doSubmit] = useFormSubmission(getFormSubmitAction(mode));
  const [errors, setErrors] = useState<Error[] | undefined>(undefined);

  useEffect(() => {
    setForm(createPolicyForm({ policy, actions, triggers, triggerDetails, actionId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy, triggerDetails, loading, actionId]);

  return {
    form,
    setForm,
    resetForm: () => setForm(createPolicyForm({ policy, actions, triggers, triggerDetails })),
    updateForm,
    doSubmit: ({ payload, onError, onSuccess }) => {
      doSubmit({
        payload,
        onSuccess,
        onError: result => {
          const dialogKey =
            mode === 'NEW'
              ? 'in-automation:policies.createDialog.failure.content'
              : 'in-automation:policies.editDialog.failure.content';
          const errorMessage = result?.errors
            ? result?.errors?.[0].message
            : t('in-components:error.erroneousResultPresenterMessage');
          const errors: Error[] = [
            {
              code: 'CLIENT',
              message: t(dialogKey, { errorMessage })
            }
          ];
          setErrors(errors);
          onError(result);
        }
      });
    },
    submitStatus,
    errors
  };
}

function getFormSubmitAction(mode: PolicyDialogMode) {
  switch (mode) {
    case 'NEW':
    case 'CLONE':
      return saveNewPolicyNew;
    case 'EDIT':
      return savePolicyNew;
  }
}
