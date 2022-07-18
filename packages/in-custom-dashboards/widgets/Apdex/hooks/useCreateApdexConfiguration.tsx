/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Item } from 'formalistic';
import { useState } from 'react';

import { FormSubmitState } from 'in-custom-dashboards/widgets/Slo/sli/components/create/CreateSliForm';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { createApdexConfiguration } from 'in-custom-dashboards/widgets/Apdex/api';
import { ApdexConfiguration, ApdexConfigurationInput, Result } from 'in-types';
import { isLoading } from 'in-services/util/result';

interface DoSubmitFunction {
  (submittedForm: Item, onSuccess: (data: Result<ApdexConfiguration>) => void, onError: () => void): void;
}

export default function useCreateApdexConfiguration(): [FormSubmitState, DoSubmitFunction] {
  const [formSubmitState, setFormSubmitState] = useState<FormSubmitState>({
    success: false,
    saving: false,
    error: false
  });

  const doSubmit: DoSubmitFunction = (submittedForm, onSuccess, onError) => {
    setFormSubmitState({
      saving: true,
      success: false,
      error: false
    });

    const submittedFormData = submittedForm.toJS();
    const { tagFilterExpression } = submittedFormData.apdexEntity;
    const apdexConfig: ApdexConfigurationInput = {
      ...submittedFormData,
      apdexEntity: {
        ...submittedFormData.apdexEntity,
        tagFilterExpression: toBackendQueryModel(tagFilterExpression as FormModelElement[])
      }
    };

    const onSuccessHandler = (data: Result<ApdexConfiguration>) => {
      setFormSubmitState({
        saving: false,
        success: true,
        error: false
      });
      onSuccess(data);
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
