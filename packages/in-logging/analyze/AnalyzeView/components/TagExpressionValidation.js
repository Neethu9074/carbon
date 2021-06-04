/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useState, useEffect } from 'react';

import { useObservable } from '@instana/hooks';

import { getValidationAsResultObservable } from 'in-logging/api/queryValidation';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';

export default function TagExpressionValidation(props) {
  // Validating the query on the backend side is async, so the validation result will arrive somewhen.
  // To avoid having subscriptions with the yet unvalidated query already, we need to take the old backendQueryModel as long
  // as the validation result has arrived.
  const [lastValidBackendQueryModel, setLastValidBackendQueryModel] = useState(props.backendQueryModel);
  const [isValid, setIsValid] = useState(true);

  const queryValidationResult =
    useObservable(getValidationAsResultObservable(props.backendQueryModel), [props.backendQueryModel]) ?? pendingResult;

  const isValidating = isLoading(queryValidationResult);
  const isQueryValid = Boolean(queryValidationResult.data?.valid);
  const validationError = queryValidationResult.data?.error;

  useEffect(() => {
    if (!isValidating) {
      setIsValid(isQueryValid);
    }
    if (isQueryValid && props.backendQueryModel !== lastValidBackendQueryModel) {
      setLastValidBackendQueryModel(props.backendQueryModel);
    }
  }, [isQueryValid, isValidating, props.backendQueryModel, lastValidBackendQueryModel]);

  return props.children({
    isValid: isValid && props.isValid,
    validationError,
    backendQueryModel: lastValidBackendQueryModel,
    isLoading: isValidating || props.isLoading
  });
}
