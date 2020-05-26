import { createMapForm } from 'formalistic';
import React, { useState } from 'react';

import renderLoadingStateDefault from 'in-settings/components/ApiItemView/FallbackLoadingView';
import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import { combineResultObservables } from 'in-services/util/result';
import TemporaryMessage from 'in-new-components/TemporaryMessage';
import Header from 'in-settings/components/ApiItemView/Header';
import connectTo from 'in-hoc/connectTo';

import locals from './ApiItemView.mless';

export default connectTo(
  ({ getObservables }) => combineResultObservables(getObservables()),

  function ApiItemView(props) {
    const {
      parentPath,
      parentViewName,
      render,
      renderLoadingState = renderLoadingStateDefault,
      enrichForm,
      result,
      saveItem
    } = props;

    if (result.errors && result.errors.length > 0) {
      const error = getUniqueErrors(result.errors)[0];
      return (
        <div className={locals.wrapper}>
          <Header parentPath={parentPath} parentViewName={parentViewName} />
          <MessageWrapper message={{ message: error, type: 'error' }} />
        </div>
      );
    }

    if (result.isLoading) {
      return (
        <div className={locals.wrapper}>
          <Header parentPath={parentPath} parentViewName={parentViewName} />
          <MessageWrapper />
          {renderLoadingState({ ...props })}
        </div>
      );
    }

    const [message, setMessage] = useState(null);
    const [form, setForm] = useState(() => createForm(enrichForm, props));
    const [canSaveItem, setCanSaveItem] = useState(false);

    return (
      <div className={locals.wrapper}>
        <Header
          parentPath={parentPath}
          parentViewName={parentViewName}
          onSaveClick={canSaveItem ? () => saveItem({ ...props, setMessage, form, setForm }) : undefined}
        />
        <MessageWrapper message={message} />
        {render({
          ...props,
          ...result,
          message,
          setMessage,
          form,
          setForm: form => {
            setForm(form);
            setCanSaveItem(true);
          },
          setCanSaveItem
        })}
      </div>
    );
  }
);

function MessageWrapper({ message }) {
  // create a random id to make sure the same message can appear multiple times
  const id = Date.now() + '';

  return (
    <div className={locals.messageWrapper}>{message && <TemporaryMessage id={id} {...message} duration={5000} />}</div>
  );
}

function createForm(enrichForm, props) {
  const form = createMapForm();
  return enrichForm ? enrichForm(form, props) : form;
}
