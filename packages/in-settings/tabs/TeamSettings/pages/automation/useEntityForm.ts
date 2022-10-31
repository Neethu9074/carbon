/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Disposable, Observable } from '@instana/observables';
import { Field, MapForm } from 'formalistic';
import { t } from 'in-i18n';
import { scrollToTopSmoothly } from 'in-services/util/dom';
import { FormEvent, useLayoutEffect, useRef, useState } from 'react';

export const savingMessage = t('in-hoc:entityFormSaving');

interface State<Entity> {
  loading: boolean;
  error: boolean;
  message: string | null;
  form: MapForm | null;
  saveEnabled: boolean;
  entity: Entity | null;
}

interface Props<Entity> {
  entityId: string | null;
  createDefaultEntity: () => Entity;
  getEntityFromApi: (entityId: string) => Observable<Entity>;
  createForm: (entity: Entity) => MapForm;
}

const initialState = {
  loading: true,
  error: false,
  form: null,
  entity: null,
  message: t('in-hoc:entityFormLoading'),
  saveEnabled: true
};

export default function useEntityForm<Entity>(props: Props<Entity>) {
  const [state, setState] = useState<State<Entity>>(initialState);
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
      message: t('in-hoc:entityFormLoading'),
      form: null
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

    const result$ = props.saveEntity(entity, form);
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

    errorSubscription.current = result$.errors().once(error => {
      let message = error.message;
      if (
        error.response &&
        error.response.body &&
        error.response.body.errors &&
        error.response.body.errors.length > 0
      ) {
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

  function onChange<ValueType>(
    fieldName: string | ((mapForm: MapForm) => MapForm),
    value: ValueType,
    updateFormDefinition: (mapForm: MapForm, entity: Entity) => MapForm,
    forceSetValue: boolean = false
  ) {
    if (typeof fieldName === 'function') {
      const updater = fieldName;
      const updatedForm = updater(state.form!);

      setState({
        ...state,
        form: updatedForm
      });

      return updatedForm;
    }

    const { entity } = state;
    let updatedForm = state.form!;

    function setFieldValue(value: ValueType, field: Field<ValueType>) {
      return field.setValue(value).setTouched(true);
    }

    if (forceSetValue) {
      updatedForm = updatedForm.put([fieldName], value);
    } else if (Array.isArray(fieldName)) {
      for (let i = 0, length = fieldName.length; i < length; i++) {
        updatedForm = updatedForm.updateIn([fieldName[i]], setFieldValue(null, value[i]));
      }
    } else {
      updatedForm = updatedForm.updateIn([fieldName], field =>
        (field as Field<ValueType>).setValue(value).setTouched(true)
      );
    }

    if (updateFormDefinition) {
      updatedForm = updateFormDefinition(updatedForm, entity!);
    }

    setState({
      ...state,
      form: updatedForm
    });

    return updatedForm;
  }

  return { ...state, onChange, onSubmit };
}
