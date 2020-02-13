import React, { useState } from 'react';

import { formUserSettingsObject } from 'in-settings/terms/termsAndPrivaySettings';
import TermsDialogPresenter from 'in-settings/terms/dialog/TermsDialogPresenter';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import termsFormDefinition from 'in-settings/terms/termsFormDefinition';

export default function TermsDialog({ onSkip, onSave, fullTermsConfigEnabled }) {
  const [saveError, setSaveError] = useState(false);
  const [form, setForm] = useState(termsFormDefinition(window.instana.termsAndPrivacySettings));

  return (
    <TermsDialogPresenter
      onSkip={onSkip || onSave}
      onSave={save(onSave, setSaveError)}
      saveError={saveError}
      unsetSaveError={() => setSaveError(false)}
      onChange={onChange(setForm)}
      form={form}
      fullTermsConfigEnabled={fullTermsConfigEnabled}
    />
  );
}

function save(onSave, setSaveError) {
  return (e, form, setForm) => {
    stopPropagationAndPreventDefault(e);
    if (!form.hierarchyValid) {
      setForm(form.setTouched(true, { recurse: true }));
      return;
    }

    const tosPrivacyAgreement = Object.freeze({
      tosAccepted: form.get('tosAccepted').value,
      privacyAgreementAccepted: form.get('privacyAgreementAccepted').value,
      userSettings: formUserSettingsObject(form)
    });

    onSave(tosPrivacyAgreement, setSaveError);
  };
}

function onChange(setForm) {
  return (form, fieldName, fieldValue) => {
    setForm(form.updateIn([fieldName], field => field.setValue(fieldValue)));
  };
}
