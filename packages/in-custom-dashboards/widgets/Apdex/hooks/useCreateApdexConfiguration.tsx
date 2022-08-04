/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useState } from 'react';

import { ApdexConfiguration, ApdexConfigurationInput, Result } from '@instana/types';

import { FormSubmitState } from 'in-custom-dashboards/widgets/Slo/sli/components/create/CreateSliForm';
import { createApdexConfiguration } from 'in-custom-dashboards/widgets/Apdex/api';
import { hasError, isLoading } from 'in-services/util/result';

interface DoSubmitFunction {
  (
    apdexConfig: ApdexConfigurationInput,
    onSuccess: (data: Result<ApdexConfiguration>) => void,
    onError: (data?: Result<ApdexConfiguration>) => void
  ): void;
}

export default function useCreateApdexConfiguration(): [FormSubmitState, DoSubmitFunction] {
  const [formSubmitState, setFormSubmitState] = useState<FormSubmitState>({
    success: false,
    saving: false,
    error: false
  });

  const doSubmit: DoSubmitFunction = (apdexConfig, onSuccess, onError) => {
    setFormSubmitState({
      saving: true,
      success: false,
      error: false
    });

    const onSuccessHandler = (data: Result<ApdexConfiguration>) => {
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

    createApdexConfiguration(apdexConfig)
      .filter(result => !isLoading(result))
      .once(onSuccessHandler, onErrorHandler);
  };

  return [formSubmitState, doSubmit];
}
