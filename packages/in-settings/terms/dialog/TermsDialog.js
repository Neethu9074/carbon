import React, { useState } from 'react';

import { formUserSettingsObject } from 'in-settings/terms/termsAndPrivaySettings';
import TermsDialogPresenter from 'in-settings/terms/dialog/TermsDialogPresenter';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import termsFormDefinition from 'in-settings/terms/termsFormDefinition';

export default function TermsDialog({ onSkip, onSave, fullTermsConfigEnabled }) {
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
      onSkip={onSkip || onSaveHandler}
      onSave={onSaveHandler}
      saveError={saveError}
      unsetSaveError={() => setSaveError(false)}
      onChange={onChange(setForm)}
      form={form}
      fullTermsConfigEnabled={fullTermsConfigEnabled}
    />
  );
}

function onChange(setForm) {
  return (form, fieldName, fieldValue) => {
    setForm(form.updateIn([fieldName], field => field.setValue(fieldValue)));
  };
}
