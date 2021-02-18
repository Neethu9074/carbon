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

    const tosPrivacyAgreement = Object.freeze({
      tosAccepted: _form.get('tosAccepted').value,
      privacyAgreementAccepted: _form.get('privacyAgreementAccepted').value,
      userSettings: formUserSettingsObject(_form)
    });

    onSave(tosPrivacyAgreement, setSaveError);
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
