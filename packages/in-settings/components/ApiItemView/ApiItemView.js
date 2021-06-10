/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm } from 'formalistic';
import React, { useState } from 'react';

import { combineLatest } from '@instana/observables';

import renderLoadingStateDefault from 'in-settings/components/ApiItemView/FallbackLoadingView';
import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import TemporaryMessage from 'in-components/TemporaryMessage/TemporaryMessageV2';
import Header from 'in-settings/components/ApiItemView/Header';
import Footer from 'in-settings/components/ApiItemView/Footer';
import { isLoading, hasError } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { error } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

import locals from './ApiItemView.mless';

export default connectTo(
  ({ getObservables }) => (getObservables ? combineResultObservables(getObservables()) : {}),

  function ApiItemView(props) {
    const { parentPath, parentViewName, renderLoadingState = renderLoadingStateDefault, result } = props;

    if (hasError(result)) {
      const error = getUniqueErrors(result.errors)[0];
      return (
        <div className={locals.wrapper}>
          <Header parentPath={parentPath} parentViewName={parentViewName} />
          <MessageWrapper message={{ message: error, type: 'error' }} />
        </div>
      );
    }

    if (isLoading(result)) {
      return (
        <div className={locals.wrapper}>
          <Header parentPath={parentPath} parentViewName={parentViewName} />
          <MessageWrapper />
          {renderLoadingState({ ...props })}
        </div>
      );
    }

    return <ApiItemViewResultPresenter {...props} />;
  }
);

function MessageWrapper({ message }) {
  const id = message?.message || '';
  return (
    <div className={locals.messageWrapper}>{message && <TemporaryMessage id={id} {...message} duration={5000} />}</div>
  );
}

function createForm(enrichForm, props) {
  const form = createMapForm();
  return enrichForm ? enrichForm(form, props) : form;
}

function ApiItemViewResultPresenter(props) {
  const {
    parentPath,
    parentViewName,
    render,
    Content,
    enrichForm,
    saveLabel,
    deleteLabel,
    result,
    saveItem,
    onCancelClick,
    onSubmit,
    hideFooter = false,
    deleteItem
  } = props;

  const [message, setMessage] = useState(null);
  const [canSaveItem, setCanSaveItem] = useState(false);
  const [savelabel, setSaveLabel] = useState(saveLabel);
  const [canDeleteItem, setCanDeleteItem] = useState(false);
  const [form, setForm] = useState(() =>
    createForm(enrichForm, { ...props, setCanSaveItem, setSaveLabel, setCanDeleteItem })
  );

  const renderProps = {
    ...props,
    ...result,
    message,
    setMessage,
    form,
    setForm: form => {
      setForm(form.setTouched(true));
      setCanSaveItem(true);
    },
    setSaveLabel,
    setCanSaveItem,
    setCanDeleteItem
  };

  const content = (
    <div className={locals.wrapper}>
      <div>
        <Header parentPath={parentPath} parentViewName={parentViewName} />
        <MessageWrapper message={message} />
        {render ? render(renderProps) : <Content {...renderProps} />}
      </div>

      {!hideFooter && (
        <Footer
          canSaveItem={canSaveItem}
          canDeleteItem={canDeleteItem}
          saveButtonVisible={saveItem || onSubmit}
          saveLabel={savelabel}
          isSaving={message?.isSaving}
          onSaveClick={saveItem ? () => saveItem({ ...props, setMessage, form, setForm, setCanSaveItem }) : undefined}
          onDeleteClick={
            deleteItem ? () => deleteItem({ ...props, setMessage, form, setForm, setCanSaveItem }) : undefined
          }
          onCancelClick={onCancelClick}
          deleteLabel={deleteLabel}
          parentPath={parentPath}
          form={form}
        />
      )}
    </div>
  );

  if (onSubmit) {
    return <form onSubmit={e => onSubmit(e, renderProps)}>{content}</form>;
  }
  return content;
}

function combineResultObservables(observables) {
  const observableKeys = Object.keys(observables);
  return {
    result: combineLatest(observableKeys.map(key => observables[key])).map(results => {
      const resultData = {};
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (isLoading(result)) {
          return pendingResult;
        }
        if (hasError(result)) {
          return error(result.errors);
        }
        resultData[observableKeys[i]] = result.data;
      }

      return resultData;
    })
  };
}
