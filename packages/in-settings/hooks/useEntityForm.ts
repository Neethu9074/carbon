/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { FormEvent, useLayoutEffect, useRef, useState } from 'react';
import { Field, MapForm } from 'formalistic';

import { Disposable, Observable } from '@instana/observables';

import { scrollToTopSmoothly } from 'in-services/util/dom';
import { t } from 'in-i18n';

export const savingMessage = t('in-hoc:entityFormSaving');

export type OnEntityChange<ENTITY> = <VALUETYPE>(
  fieldName: string | ((mapForm: MapForm) => MapForm),
  value: VALUETYPE,
  updateFormDefinition?: (mapForm: MapForm, entity: ENTITY) => MapForm
) => MapForm;

export type SetForm = (form: MapForm) => void;

interface State<ENTITY> {
  loading: boolean;
  error: boolean;
  message: string | null;
  form: MapForm | null;
  saveEnabled: boolean;
  entity: ENTITY | null;
}

interface Parameters<ENTITY> {
  entityId: string | null;
  createDefaultEntity: () => ENTITY;
  getEntityFromApi: (entityId: string) => Observable<ENTITY>;
  createForm: (entity: ENTITY) => MapForm;
  onSaveSuccess?: () => void;
  openEntities?: () => void;
  saveEntity: (entity: ENTITY, mapForm: MapForm) => Observable<any>;
  onSaveError?: (message: string) => void;
}

const initialState = {
  loading: true,
  error: false,
  form: null,
  entity: null,
  message: t('in-hoc:entityFormLoading'),
  saveEnabled: true
};

export default function useEntityForm<ENTITY>(props: Parameters<ENTITY>) {
  const [state, setState] = useState<State<ENTITY>>(initialState);
  const responseSubscription = useRef<Disposable>();
  const errorSubscription = useRef<Disposable>();

  const { entityId, createDefaultEntity, createForm, getEntityFromApi } = props;

  useLayoutEffect(() => {
    load();

    return () => {
      disposeAsyncAction();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId]);

  function load() {
    disposeAsyncAction();

    if (!entityId) {
      const entity = createDefaultEntity();
      setState({
        ...state,
        loading: false,
        error: false,
        message: null,
        entity,
        form: createForm(entity)
      });
      return;
    }

    setState({
      ...state,
      loading: true,
      error: false,
      message: savingMessage
    });

    const apiEntityResult$ = getEntityFromApi(entityId);
    responseSubscription.current = apiEntityResult$.once(entity => {
      setState({
        ...state,
        loading: false,
        error: false,
        message: null,
        entity,
        form: props.createForm(entity)
      });
    });

    errorSubscription.current = apiEntityResult$.errors().once(() => {
      scrollToTopSmoothly();
      setState({
        ...state,
        loading: false,
        error: true,
        message: t('in-hoc:entityFormFailedToLoadData')
      });
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    const { entity, form } = state;

    if (!form!.hierarchyValid) {
      setState({
        ...state,
        form: form!.setTouched(true, { recurse: true })
      });
      return;
    }

    const result$ = props.saveEntity(entity!, form!);
    disposeAsyncAction();

    setState({
      ...state,
      loading: true,
      error: false,
      message: savingMessage
    });

    responseSubscription.current = result$.once(() => {
      setState({
        ...state,
        loading: false,
        error: false
      });
      props.onSaveSuccess?.();
      props.openEntities?.();
    });

    errorSubscription.current = result$.errors().once((error: any) => {
      let message = error.message;
      if (error?.response?.body?.errors?.length > 0) {
        message = error.response.body.errors.join(', ');
      }
      scrollToTopSmoothly();
      props.onSaveError?.(message);
      setState({
        ...state,
        loading: false,
        error: true,
        message: t('in-hoc:entityFormFailedToSave', { SaveFailureMessage: message })
      });
    });
  }

  function disposeAsyncAction() {
    if (responseSubscription.current) {
      responseSubscription.current.dispose();
    }

    if (errorSubscription.current) {
      errorSubscription.current.dispose();
    }
  }

  const onChange: OnEntityChange<ENTITY> = <VALUETYPE>(
    fieldName: string | ((mapForm: MapForm) => MapForm),
    value: VALUETYPE,
    updateFormDefinition?: (mapForm: MapForm, entity: ENTITY) => MapForm
  ) => {
    let updatedForm = state.form!;

    if (typeof fieldName === 'function') {
      const updater = fieldName;
      updatedForm = updater(updatedForm);

      setForm(updatedForm);

      return updatedForm;
    }

    updatedForm = updatedForm.updateIn([fieldName], field =>
      (field as Field<typeof value>).setValue(value).setTouched(true)
    );

    updatedForm = updateFormDefinition?.(updatedForm, state.entity!) ?? updatedForm;

    setForm(updatedForm);

    return updatedForm;
  };

  const setForm: SetForm = function(form) {
    setState({
      ...state,
      form
    });
  };

  function setSaveEnabled(saveEnabled: boolean) {
    setState({
      ...state,
      saveEnabled
    });
  }

  return { ...state, onChange, onSubmit, isCreate: !entityId, setForm, setSaveEnabled };
}
