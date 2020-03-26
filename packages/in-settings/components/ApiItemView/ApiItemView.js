import { combineLatest } from 'reactive-observables';
import { createMapForm } from 'formalistic';
import React, { useState } from 'react';

import renderFallbackLoadingView from 'in-settings/components/ApiItemView/FallbackLoadingView';
import BackToParentPathLink from 'in-settings/components/ApiItemView/BackToParentPathLink';
import { neutral, success, error as errorType } from 'in-new-components/Message/types';
import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import Footer from 'in-settings/components/ApiItemView/Footer';
import { isLoading, hasError } from 'in-services/util/result';
import Message from 'in-new-components/Message';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ getObservables }) => getResults(getObservables()),

  function ApiItemView(props) {
    const {
      parentPath,
      parentViewName,
      render,
      renderLoadingState = renderFallbackLoadingView,
      enrichForm,
      result,
      saveItem
    } = props;
    if (result.errors && result.errors.length > 0) {
      const error = getUniqueErrors(result.errors)[0];
      return (
        <SettingsDetailPage>
          <BackToParentPathLink parentPath={parentPath} parentViewName={parentViewName} />
          <Message type={errorType} withIcon small>
            {error}
          </Message>
        </SettingsDetailPage>
      );
    }

    if (result.isLoading) {
      return (
        <SettingsDetailPage>
          <BackToParentPathLink parentPath={parentPath} parentViewName={parentViewName} />
          {renderLoadingState({ ...props })}
        </SettingsDetailPage>
      );
    }

    const [message, setMessage] = useState(null);
    const [form, setForm] = useState(createForm(enrichForm, props));
    const [canSaveItem, setCanSaveItem] = useState(false);

    const setFormAndUpdateSave = form => {
      setForm(form);
      setCanSaveItem(true);
    };

    return (
      <SettingsDetailPage>
        <BackToParentPathLink parentPath={parentPath} parentViewName={parentViewName} />

        {render({ ...props, ...result, message, setMessage, form, setForm: setFormAndUpdateSave, setCanSaveItem })}

        <Footer
          message={message}
          parentPath={parentPath}
          onSaveClick={canSaveItem ? () => onSave(saveItem, setMessage, form) : undefined}
        />
      </SettingsDetailPage>
    );
  }
);

function onSave(saveItem, setMessage, form) {
  const apiCallResult$ = saveItem(form);
  setMessage({ text: 'Saving…', type: neutral });
  apiCallResult$.once(
    () => {
      setMessage({ text: 'Saved successfully.', type: success });
    },
    error => setMessage({ text: `Failed while saving: ${error.message}`, type: errorType })
  );
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
