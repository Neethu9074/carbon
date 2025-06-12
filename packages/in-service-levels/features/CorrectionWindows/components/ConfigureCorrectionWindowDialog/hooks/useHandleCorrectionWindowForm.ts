/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useEffect, useState } from 'react';

import { Result, CorrectionConfiguration, Error } from '@instana/types';
import { Observable } from '@instana/observables';

import useCorrectionWindowFormSideEffects, {
  CorrectionWindowFormSideEffectsReturnType
} from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/hooks/useCorrectionWindowFormSideEffects';
import { createCorrectionWindowForm } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/createCorrectionWindowForm';
import { CorrectionWindowForm } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/types';
import {
  createCorrectionConfiguration,
  updateCorrectionConfiguration
} from 'in-service-levels/api/correctionConfiguration';
import useFormSubmission, { DoSubmitFunction } from 'in-hooks/useFormSubmission';
import { ConfigureDialogMode } from 'in-service-levels/types';
import { FetchStatus } from 'in-hooks/utils/types';

type CorrectionWindowFormSubmissionAction = (
  config: CorrectionConfiguration
) => Observable<Result<CorrectionConfiguration>>;

interface UseHandleCorrectionWindowFormReturn {
  form: CorrectionWindowForm;
  setForm: React.Dispatch<React.SetStateAction<CorrectionWindowForm>>;
  updateForm: CorrectionWindowFormSideEffectsReturnType;
  submitStatus: FetchStatus | undefined;
  doSubmit: DoSubmitFunction<CorrectionConfiguration, CorrectionConfiguration>;
  resetForm: () => void;
  errors: Error[] | undefined;
}

interface UseHandleCorrectionWindowFormParams {
  mode: ConfigureDialogMode;
  configuration?: CorrectionConfiguration;
}

export default function useHandleCorrectionWindowForm({
  mode,
  configuration
}: UseHandleCorrectionWindowFormParams): UseHandleCorrectionWindowFormReturn {
  const createForm = () => createCorrectionWindowForm({ config: configuration });
  const [form, setForm] = useState(createForm());
  const updateForm = useCorrectionWindowFormSideEffects(form, setForm);
  const [submitStatus, doSubmit] = useFormSubmission(getFormSubmitAction(mode));
  const [errors, setErrors] = useState<Error[] | undefined>(undefined);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (errors && errors.length > 0) setErrors(undefined);
    }, 6000);

    return () => clearTimeout(timeoutId);
  }, [errors]);

  return {
    form,
    setForm,
    updateForm,
    submitStatus,
    doSubmit: ({ payload, onError, onSuccess }) => {
      doSubmit({
        payload,
        onSuccess,
        onError: result => {
          setErrors(result?.errors);
          onError(result);
        }
      });
    },
    resetForm: () => setForm(createForm()),
    errors
  };
}

function getFormSubmitAction(mode: ConfigureDialogMode): CorrectionWindowFormSubmissionAction {
  switch (mode) {
    case 'NEW':
    case 'CLONE':
      return createCorrectionConfiguration;
    case 'EDIT':
      return updateCorrectionConfiguration;
  }
}
