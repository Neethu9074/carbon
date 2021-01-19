/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { useState } from 'react';

import { savingMessage as entityFormSavingMessage } from 'in-hoc/entityForm';

export const initialState = Object.freeze({
  message: '',
  storing: false,
  error: false
});

export function useSaveToServerHandler(createSubmitObservable, optionalLogger) {
  const [savingState, setStoringState] = useState(initialState);

  function save(payload) {
    setStoringState({
      message: entityFormSavingMessage,
      storing: true,
      error: false
    });
    const saveResult$ = createSubmitObservable(payload);
    saveResult$.once(() => {
      setStoringState(initialState);
    });
    saveResult$.errors().once(error => {
      optionalLogger?.error(`Failed to save payload onto server: ${error.message}`, error);
      setStoringState({
        message: error.message,
        storing: false,
        error: true
      });
    });
  }

  return { savingState, save };
}
