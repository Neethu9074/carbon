/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect, useRef, useState } from 'react';

import { Disposable, Observable } from '@instana/observables';

import {
  Integration,
  IntegrationForm,
  IntegrationFormPath
} from 'in-settings/tabs/GlobalSettings/pages/integrations/database/types';
import { t } from 'in-i18n';

export interface IntegrationFormParameters {
  integrationKey: string;
  failedToLoadMessage: string;
  getIntegrations: () => Observable<Integration[]>;
  saveIntegration: (updatedIntegration: Integration) => Observable<Integration>;
  createForm: (integration?: Integration) => IntegrationForm;
  onSaveSuccess: () => void;
  onSaveError?: () => void;
}

interface State {
  form: IntegrationForm | null;
  loading: boolean;
  message: string | null;
}

const initialState: State = {
  form: null,
  message: t('in-settings:tabs.loading'),
  loading: true
};

interface IntegrationFormState extends State {
  onChange: (fieldName: IntegrationFormPath, value: string | boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function useIntegrationForm(params: IntegrationFormParameters): IntegrationFormState {
  const {
    integrationKey,
    failedToLoadMessage,
    getIntegrations,
    saveIntegration,
    createForm,
    onSaveSuccess,
    onSaveError
  } = params;
  const [state, setState] = useState<State>(initialState);
  const responseSubscription = useRef<Disposable>();
  const errorSubscription = useRef<Disposable>();

  const disposeAsyncAction = () => {
    if (responseSubscription.current) {
      responseSubscription.current.dispose();
    }
    if (errorSubscription.current) {
      errorSubscription.current.dispose();
    }
  };

  useEffect(() => {
    if (state.form === null) {
      const result$ = getIntegrations();
      responseSubscription.current = result$.once(integrations => {
        const integration = integrations.find(i => i.type === integrationKey);
        setState({ ...state, form: createForm(integration), message: '', loading: false });
      });
      errorSubscription.current = result$.errors().once(() => {
        setState({
          ...state,
          message: failedToLoadMessage,
          loading: false
        });
      });
      return () => {
        disposeAsyncAction();
      };
    } else {
      return () => disposeAsyncAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (fieldName: IntegrationFormPath, value: string | boolean) => {
    // at this point, it is guaranteed that the form exists
    const form = state.form!;
    // formalistic can't handle complex VALUE_TYPE like "string | boolean", so we need to handle field as "any" instead of "Field<string> | Field<boolean>"
    const updatedForm = form.updateIn(fieldName, (field: any) => field.setValue(value).setTouched(true));
    setState({ ...state, form: updatedForm });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let form = state.form;

    if (!form?.hierarchyValid) {
      setState({
        ...state,
        form: form!.setTouched(true, { recurse: true })
      });
      return;
    }

    const result$ = saveIntegration(form.toJS());
    disposeAsyncAction();
    setState({ ...state, loading: true, message: t('in-settings:tabs.saving') });

    responseSubscription.current = result$.once(() => {
      setState({ ...state, loading: false, message: '' });
      if (onSaveSuccess != null) {
        onSaveSuccess();
      }
    });

    errorSubscription.current = result$.errors().once(error => {
      const message = t('in-settings:tabs.failedToSaveConfiguration', { err: error.message });
      setState({ ...state, loading: false, message });
      if (onSaveError != null) {
        onSaveError();
      }
    });
  };

  return { ...state, onChange, onSubmit };
}
