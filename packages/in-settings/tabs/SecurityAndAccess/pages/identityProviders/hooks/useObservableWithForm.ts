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

import { getUniqueErrors } from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';

interface FormWithObservableProps<T, FORM_ITEMS extends MapFormItems> {
  observable: () => Observable<Result<T>>;
  createForm: (apiResult?: T, isActive?: boolean) => MapForm<FORM_ITEMS>;
  isActive?: boolean;
}

interface FormWithObservableResult<T, FORM_ITEMS extends MapFormItems> {
  form: MapForm<FORM_ITEMS>;
  setForm: React.Dispatch<React.SetStateAction<MapForm<FORM_ITEMS>>>;
  dataFromObservable?: Result<T>;
  loading: boolean;
  errorMessage: string | undefined;
}

const useFormWithObservable = <T, FORM_ITEMS extends MapFormItems>(
  props: FormWithObservableProps<T, FORM_ITEMS>
): FormWithObservableResult<T, FORM_ITEMS> => {
  const { observable, createForm, isActive } = props;

  const [form, setForm] = useState<MapForm<FORM_ITEMS>>(createForm());
  const dataFromObservable = useObservable(observable, []) ?? pendingResult;
  const loading = isLoading(dataFromObservable);
  const errors = hasError(dataFromObservable);
  const errorMessage = errors ? getUniqueErrors(dataFromObservable.errors)[0] : undefined;

  useEffect(() => {
    if (dataFromObservable && dataFromObservable.data) {
      setForm(() => createForm(dataFromObservable.data, isActive));
    }
  }, [dataFromObservable, setForm, createForm, isActive]);

  return { form, setForm, dataFromObservable, loading, errorMessage };
};

export default useFormWithObservable;
