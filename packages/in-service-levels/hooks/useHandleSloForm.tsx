/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useState } from 'react';
import type React from 'react';

import type { Result, ServiceLevelObjectiveConfiguration } from '@instana/types';
import type { Observable } from '@instana/observables';

import { createSloConfiguration, updateSloConfiguration } from 'in-service-levels/api/sloConfiguration';
import { createSloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/createSloForm';
import type { SloFormSideEffectsReturnType } from 'in-service-levels/hooks/useSloFormSideEffects';
import type { SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import useSloFormSideEffects from 'in-service-levels/hooks/useSloFormSideEffects';
import type { ConfigureDialogMode } from 'in-service-levels/types';
import useFormSubmission from 'in-hooks/useFormSubmission';
import type { FetchStatus } from 'in-hooks/utils/types';

export interface UseHandleSloFormProps {
  mode: ConfigureDialogMode;
  configuration?: ServiceLevelObjectiveConfiguration;
}

export type SloFormSubmissionAction = (
  config: ServiceLevelObjectiveConfiguration
) => Observable<Result<ServiceLevelObjectiveConfiguration>>;

export interface UseHandleSloFormReturn {
  form: SloForm;
  setForm: React.Dispatch<React.SetStateAction<SloForm>>;
  updateForm: SloFormSideEffectsReturnType;
  submitStatus: FetchStatus | undefined;
  doSubmit: ReturnType<
    typeof useFormSubmission<ServiceLevelObjectiveConfiguration, ServiceLevelObjectiveConfiguration>
  >[1];
  resetForm: VoidFunction;
}

export default function useHandleSloForm({ mode, configuration }: UseHandleSloFormProps): UseHandleSloFormReturn {
  const createForm = () => createSloForm({ entityType: 'application', sloConfig: configuration });
  const [form, setForm] = useState(createForm());
  const updateForm = useSloFormSideEffects(form, setForm);
  const [submitStatus, doSubmit] = useFormSubmission(getFormSubmitAction(mode));

  return {
    form,
    setForm,
    updateForm,
    submitStatus,
    doSubmit,
    resetForm: () => setForm(createForm())
  };
}

function getFormSubmitAction(mode: ConfigureDialogMode): SloFormSubmissionAction {
  switch (mode) {
    case 'NEW':
    case 'CLONE':
      return createSloConfiguration;

    case 'EDIT':
      return updateSloConfiguration;
  }
}
