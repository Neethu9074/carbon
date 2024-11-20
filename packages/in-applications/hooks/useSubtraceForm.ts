/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import { useState } from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error needs TS migration
import { isQueryValid } from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import { createSubtraceForm } from 'in-applications/creation/form/createSubtraceForm';
import { Subtrace } from 'in-applications/lists/SubtracesList';
import { hasError, isLoading } from 'in-services/util/result';
import { SubtraceFormFields } from 'in-applications/types';
import { pendingResult } from 'in-services/fixedObjects';
import { Result } from 'in-types';

export const useSubtraceForm = (subtrace?: Subtrace) => {
  const [form, updateForm] = useState(createSubtraceForm(subtrace));
  const tagFilterExpressionFormModel = form.get('tagFilterExpression').value;
  const validTagFilterExpressionResult: Result<any> =
    useObservable(isQueryValid, [tagFilterExpressionFormModel]) ?? pendingResult;

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
