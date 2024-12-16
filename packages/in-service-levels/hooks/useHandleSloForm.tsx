/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useState } from 'react';
import React from 'react';

import { Result, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { Observable } from '@instana/observables';

import useSloFormSideEffects, { SloFormSideEffectsReturnType } from 'in-service-levels/hooks/useSloFormSideEffects';
import { CreateSloDialogMode, SloForm } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { createSloConfiguration, updateSloConfiguration } from 'in-service-levels/api/configuration';
import { createSloForm } from 'in-service-levels/components/ConfigDialog/createSloForm';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { FetchStatus } from 'in-hooks/utils/types';

export interface UseHandleSloFormProps {
  mode: CreateSloDialogMode;
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

function getFormSubmitAction(mode: CreateSloDialogMode): SloFormSubmissionAction {
  switch (mode) {
    case 'NEW':
    case 'CLONE':
      return createSloConfiguration;

    case 'EDIT':
      return updateSloConfiguration;
  }
}
