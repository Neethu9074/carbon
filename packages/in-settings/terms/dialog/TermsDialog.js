/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import termsFormDefinition, { addDynamicRoleField } from 'in-settings/terms/termsFormDefinition';
import { formUserSettingsObject } from 'in-settings/terms/termsAndPrivaySettings';
import TermsDialogPresenter from 'in-settings/terms/dialog/TermsDialogPresenter';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { user } from 'in-stores/user';

export default function TermsDialog({ onSave, fullTermsConfigEnabled }) {
  const [saveError, setSaveError] = useState(false);
  const [form, setForm] = useState(termsFormDefinition(window.instana.termsAndPrivacySettings));

  const onSaveHandler = (e, _form) => {
    stopPropagationAndPreventDefault(e);
    if (!_form.hierarchyValid) {
      setForm(_form.setTouched(true, { recurse: true }));
      return;
    }
    const updatedForm = _form.updateIn(['showUserGoalSelection'], field => field.setValue(true));
    const userPreferences = Object.freeze({
      // TODO
      tosAccepted: true,
      privacyAgreementAccepted: true,
      userSettings: formUserSettingsObject(updatedForm)
    });

    onSave(userPreferences, setSaveError);
  };

  return (
    <TermsDialogPresenter
      fullTermsConfigEnabled={fullTermsConfigEnabled}
      onSave={onSaveHandler}
      saveError={saveError}
      unsetSaveError={() => setSaveError(false)}
      onChange={onChange(setForm)}
      form={form}
      userName={user.fullName}
      userEmail={user.email}
    />
  );
}

function onChange(setForm) {
  return (form, fieldName, fieldValue) => {
    let updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    if (fieldName === 'role') {
      updatedForm = addDynamicRoleField(updatedForm, window.instana.termsAndPrivacySettings);
    }

    setForm(updatedForm);
  };
}
