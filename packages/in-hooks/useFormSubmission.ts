/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useState } from 'react';

import { Observable } from '@instana/observables';
import { Result } from '@instana/types';

import { hasError, isLoading } from 'in-services/util/result';
import { FetchStatus } from 'in-hooks/utils/types';

interface DoSubmitFunctionProps<PAYLOAD, RESULT_TYPE> {
  payload: PAYLOAD;
  onSuccess: (data: Result<RESULT_TYPE>) => void;
  onError: (data?: Result<RESULT_TYPE>) => void;
}

export type DoSubmitFunction<PAYLOAD, RESULT_TYPE> = (props: DoSubmitFunctionProps<PAYLOAD, RESULT_TYPE>) => void;

export default function useFormSubmission<PAYLOAD, RESULT_TYPE>(
  callback$: (payload: PAYLOAD) => Observable<Result<RESULT_TYPE>>
): [FetchStatus | undefined, DoSubmitFunction<PAYLOAD, RESULT_TYPE>] {
  const [formSubmitStatus, setFormSubmitStatus] = useState<FetchStatus>();

  const doSubmit: DoSubmitFunction<PAYLOAD, RESULT_TYPE> = ({ payload, onSuccess, onError }) => {
    setFormSubmitStatus('pending');

    const onSuccessHandler = (data: Result<RESULT_TYPE>) => {
      const errored = hasError(data);
      setFormSubmitStatus(errored ? 'rejected' : 'resolved');

      if (errored) return onError(data);
      return onSuccess(data);
    };

    const onErrorHandler = () => {
      setFormSubmitStatus('rejected');
      onError();
    };

    callback$(payload)
      .filter(result => !isLoading(result))
      .once(onSuccessHandler, onErrorHandler);
  };

  return [formSubmitStatus, doSubmit];
}
