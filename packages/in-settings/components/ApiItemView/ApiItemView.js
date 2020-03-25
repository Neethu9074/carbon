import { combineLatest } from 'reactive-observables';
import { createMapForm } from 'formalistic';
import React, { useState } from 'react';

import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import TemporaryMessage from 'in-new-components/TemporaryMessage';
import Header from 'in-settings/components/ApiItemView/Header';
import { isLoading, hasError } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

import locals from './ApiItemView.mless';

export default connectTo(
  ({ getObservables }) => getResults(getObservables()),

  function ApiItemView(props) {
    const { parentPath, parentViewName, render, renderLoadingState, enrichForm, result, saveItem } = props;

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
    const [form, setForm] = useState(createForm(enrichForm, props));
    const [canSaveItem, setCanSaveItem] = useState(false);

    return (
      <div className={locals.wrapper}>
        <Header
          parentPath={parentPath}
          parentViewName={parentViewName}
          onSaveClick={canSaveItem ? () => saveItem({ ...props, setMessage, form }) : undefined}
        />
        <MessageWrapper message={message} />
        {render({ ...props, ...result, message, setMessage, form, setForm, setCanSaveItem })}
      </div>
    );
  }
);

function MessageWrapper({ message }) {
  return <div className={locals.messageWrapper}>{message && <TemporaryMessage {...message} duration={5000} />}</div>;
}

function createForm(enrichForm, props) {
  const form = createMapForm();
  return enrichForm ? enrichForm(form, props) : form;
}

function getResults(observables) {
  const observableKeys = Object.keys(observables);
  return {
    result: combineLatest(observableKeys.map(key => observables[key])).map(results => {
      const resultData = {};
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (isLoading(result)) {
          return { isLoading: true };
        }
        if (hasError(result)) {
          return { errors: result.errors };
        }
        resultData[observableKeys[i]] = result.data;
      }

      return resultData;
    })
  };
}
