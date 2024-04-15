/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm } from 'formalistic';
import React, { useState } from 'react';

import { Message } from '@instana/components';

import renderLoadingStateDefault from 'in-settings/components/ApiItemView/FallbackLoadingView';
import { getUniqueErrors } from 'in-components/Errors/ErroneousResultPresenter';
import TemporaryPresenter from 'in-components/TemporaryPresenter';
import Header from 'in-settings/components/ApiItemView/Header';
import Footer from 'in-settings/components/ApiItemView/Footer';
import { isLoading, hasError } from 'in-services/util/result';

import locals from './ApiItemView.mless';

//APIItemView without connectTo
export default function ApiItemView(props) {
  const {
    parentPath,
    parentViewName,
    renderLoadingState = renderLoadingStateDefault,
    result = { progress: { loading: true } }
  } = props;

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

function MessageWrapper({ message }) {
  if (!message) return null;
  const id = message.message || '';
  const text = message.text || message.message;
  return (
    <TemporaryPresenter duration={5000} id={id}>
      <Message className={locals.messageWrapper} type={message.type} inline withIcon small>
        {text}
      </Message>
    </TemporaryPresenter>
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
    <div data-testid="api-item-view-content" className={locals.wrapper}>
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
