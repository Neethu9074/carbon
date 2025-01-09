/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import { useState } from 'react';

import { useObservable } from '@instana/hooks';

import { isCallQueryValid } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { createSubtraceForm } from 'in-applications/creation/form/createSubtraceForm';
import { Subtrace } from 'in-applications/lists/SubtracesList';
import { hasError, isLoading } from 'in-services/util/result';
import { SubtraceFormFields } from 'in-applications/types';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Result } from 'in-types';

export const useSubtraceForm = (subtrace?: Subtrace) => {
  const timeConfig = useTimeConfig();
  const [form, updateForm] = useState(createSubtraceForm(subtrace));
  const tagFilterExpressionFormModel = form.get('tagFilterExpression').value;
  const validTagFilterExpressionResult =
    useObservable(isCallQueryValid, [tagFilterExpressionFormModel, timeConfig]) ?? pendingResult;

  const isFormValid = isValid(form, validTagFilterExpressionResult);
  const resetForm = () => updateForm(createSubtraceForm(subtrace));

  return { form, updateForm, resetForm, isFormValid };
};

function isValid(form: MapForm<SubtraceFormFields>, validTagFilterExpressionResult: Result<any>) {
  return (
    form.hierarchyValid &&
    !isLoading(validTagFilterExpressionResult) &&
    !hasError(validTagFilterExpressionResult) &&
    validTagFilterExpressionResult.data === true
  );
}
