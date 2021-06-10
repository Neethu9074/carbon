/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useState, useRef, useLayoutEffect } from 'react';
import { fromJS } from 'immutable';

import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import { scrollToTopSmoothly } from 'in-services/util/dom';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

export const savingMessage = t('in-hoc:entityFormSaving');

const initialState = {
  loading: true,
  error: false,
  form: null,
  entity: null,
  message: t('in-hoc:entityFormLoading'),
  saveEnabled: true
};

export default function entityForm(ComposedComponent) {
  function FormWithComposedComponent(props) {
    const [state, setState] = useState(initialState);
    const responseSubscription = useRef();
    const errorSubscription = useRef();

    const { title, entityId } = props;
    const { form, entity, saveEnabled } = state;

    useLayoutEffect(() => {
      load(props);

      return () => {
        disposeAsyncAction();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entityId]);

    if (!entity) {
      return <LoadingIndicator />;
    }

    return (
      <Fragment>
        <Title title={title} />
        <form onSubmit={onSubmit}>
          <ComposedComponent
            {...props}
            {...state}
            entity={entity}
            form={form}
            onChange={onChange}
            setForm={form => setState({ ...state, form })}
            setSaveEnabled={saveEnabled => setState({ ...state, saveEnabled })}
            saveEnabled={saveEnabled}
          />
        </form>
      </Fragment>
    );

    function load({ entityId, createDefaultEntity, getEntityFromApi }) {
      disposeAsyncAction();

      if (!entityId) {
        const entity = fromJS(createDefaultEntity());
        setState({
          ...state,
          loading: false,
          error: false,
          message: null,
          entity,
          isCreate: true,
          form: props.createForm(entity)
        });
        return;
      }

      setState({
        ...state,
        loading: true,
        error: false,
        message: t('in-hoc:entityFormLoading'),
        isCreate: false,
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

    function onSubmit(e) {
      e.preventDefault();

      const { entity, form } = state;

      if (!form.hierarchyValid) {
        setState({
          ...state,
          form: form.setTouched(true, { recurse: true })
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

    function onChange(fieldName, value, updateFormDefinition, forceSetValue) {
      if (typeof fieldName === 'function') {
        const updater = fieldName;
        const updatedForm = updater(state.form);

        setState({
          ...state,
          form: updatedForm
        });

        return updatedForm;
      }

      const { entity } = state;
      let updatedForm = state.form;

      if (forceSetValue) {
        updatedForm = updatedForm.put([fieldName], value);
      } else if (Array.isArray(fieldName)) {
        for (let i = 0, length = fieldName.length; i < length; i++) {
          updatedForm = updatedForm.updateIn([fieldName[i]], setFieldValue(null, value[i]));
        }
      } else {
        updatedForm = updatedForm.updateIn([fieldName], field => field.setValue(value).setTouched(true));
      }

      if (updateFormDefinition) {
        updatedForm = updateFormDefinition(updatedForm, entity);
      }

      setState({
        ...state,
        form: updatedForm
      });

      return updatedForm;
    }

    function setFieldValue(value, field) {
      return field.setValue(value).setTouched(true);
    }
  }

  FormWithComposedComponent.displayName = getDisplayName(ComposedComponent, 'EntityFormHoc');

  return FormWithComposedComponent;
}
