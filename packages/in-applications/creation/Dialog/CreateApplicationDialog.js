/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createLogger } from '@instana/logger';
import React, { useState } from 'react';

import {
  applicationCreationModeSwitch,
  applicationCreationCloseDialogClick,
  applicationCreationCreateClick
} from 'in-applications/creation/tracker';
import CreateApplicationDialogPresenter from 'in-applications/creation/Dialog/CreateApplicationDialogPresenter';
import { createApplicationPerspectiveForm } from 'in-applications/creation/form/createApplicationForm';
import { isQueryValid } from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import AdvancedModeContainer from 'in-applications/creation/advanced/AdvancedModeContainer';
import SimpleModeContainer from 'in-applications/creation/simple/SimpleModeContainer';
import { addApplicationConfig } from 'in-api/applicationConfigs';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import { goToPath } from 'in-stores/navigation';

const logger = createLogger('in-applications/creation/Dialog/CreateApplicationDialog');

export default function CreateApplicationDialog({ formData, timeConfig, onClose, getOnSavePath }) {
  const [form, setForm] = useState(() => createApplicationPerspectiveForm(formData));
  const [isSaving, setIsSaving] = useState(false);
  const [simpleMode, setSimpleMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const tagFilterExpression = form.get('tagFilterExpression')?.value;
  const validTagFilterExpressionResult =
    useObservable(isQueryValid, [tagFilterExpression, timeConfig]) ?? pendingResult;

  return (
    <CreateApplicationDialogPresenter
      SimpleModeElement={SimpleModeContainer}
      AdvancedModeElement={AdvancedModeContainer}
      form={form}
      updateForm={setForm}
      timeConfig={timeConfig}
      onClose={onClose}
      onCreate={() =>
        createApplication(
          form,
          getOnSavePath,
          setForm,
          isSaving,
          setIsSaving,
          applicationCreationCreateClick,
          onClose,
          setErrorMessage
        )
      }
      simpleMode={simpleMode}
      setSimpleMode={setSimpleMode}
      trackModeSwitch={(simpleMode, step) => {
        applicationCreationModeSwitch(
          simpleMode
            ? {
                destinationMode: 'Advanced Mode',
                step
              }
            : {
                destinationMode: 'Simple Mode'
              }
        );
      }}
      withTrackClose={trackingConfig => {
        applicationCreationCloseDialogClick(trackingConfig ? { step: trackingConfig } : { mode: 'Advanced' });
        onClose();
      }}
      isValidTagFilterExpression={validTagFilterExpressionResult?.data}
      errorMessage={errorMessage}
    />
  );
}

function createApplication(
  form,
  getOnSavePath,
  setForm,
  isSaving,
  setIsSaving,
  applicationCreationCreateClick,
  onClose,
  setErrorMessage
) {
  setIsSaving(true);
  setErrorMessage(null);

  if (!form.hierarchyValid) {
    setForm(form.setTouched(true, { recurse: true }));
    setIsSaving(false);
    return;
  }
  const entityToUpdate = form.toJS();
  const result$ = addApplicationConfig(entityToUpdate);

  result$.once(
    result => {
      applicationCreationCreateClick(entityToUpdate);
      goToPath(getOnSavePath(result));
      onClose();
    },
    error => {
      logger.error(`failed to create AP: ${error.message}`, error);
      setIsSaving(false);
      setErrorMessage(error.message);
    }
  );
}
