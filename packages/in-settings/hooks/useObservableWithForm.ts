/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm, MapFormItems } from 'formalistic';
import { useEffect, useState } from 'react';

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import { pendingResult } from 'in-services/fixedObjects';

interface FormWithObservableProps<T, FORM_ITEMS extends MapFormItems> {
  observable: () => Observable<Result<T>>;
  createForm: (apiResult?: T) => MapForm<FORM_ITEMS>;
}
const useFormWithObservable = <T, FORM_ITEMS extends MapFormItems>(props: FormWithObservableProps<T, FORM_ITEMS>) => {
  const { observable, createForm } = props;

  const [form, setForm] = useState(createForm());
  const dataFromObservable = useObservable(observable, []) ?? pendingResult;

  useEffect(() => {
    if (dataFromObservable && dataFromObservable.data) {
      setForm(() => createForm(dataFromObservable.data));
    }
  }, [dataFromObservable, setForm, createForm]);

  return { form, setForm, dataFromObservable };
};

export default useFormWithObservable;
