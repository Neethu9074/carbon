/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useState } from 'react';

import { Observable } from '@instana/observables';
import { Result } from '@instana/types';

import { FormSubmitState } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { hasError, isLoading } from 'in-services/util/result';

interface DoSubmitFunctionProps<CONFIG_INPUT, RESULT_TYPE> {
  config: CONFIG_INPUT;
  onSuccess: (data: Result<RESULT_TYPE>) => void;
  onError: (data?: Result<RESULT_TYPE>) => void;
}

type DoSubmitFunction<CONFIG_INPUT, RESULT_TYPE> = (props: DoSubmitFunctionProps<CONFIG_INPUT, RESULT_TYPE>) => void;

export function useCreateConfiguration<CONFIG_INPUT, RESULT_TYPE>(
  createConfigFunc: (config: CONFIG_INPUT) => Observable<Result<RESULT_TYPE>>
): [FormSubmitState, DoSubmitFunction<CONFIG_INPUT, RESULT_TYPE>] {
  const [formSubmitState, setFormSubmitState] = useState<FormSubmitState>({
    success: false,
    saving: false,
    error: false
  });

  const doSubmit: DoSubmitFunction<CONFIG_INPUT, RESULT_TYPE> = ({ config, onSuccess, onError }) => {
    setFormSubmitState({
      saving: true,
      success: false,
      error: false
    });

    const onSuccessHandler = (data: Result<RESULT_TYPE>) => {
      const errored = hasError(data);
      setFormSubmitState({
        saving: false,
        success: !errored,
        error: errored
      });
      if (errored) return onError(data);
      return onSuccess(data);
    };

    const onErrorHandler = () => {
      setFormSubmitState({
        saving: false,
        success: false,
        error: true
      });
      onError();
    };

    createConfigFunc(config)
      .filter(result => !isLoading(result))
      .once(onSuccessHandler, onErrorHandler);
  };

  return [formSubmitState, doSubmit];
}
