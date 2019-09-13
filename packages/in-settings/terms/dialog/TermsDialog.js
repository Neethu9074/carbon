import { create } from 'reactive-observables';
import React, { useState } from 'react';

import TermsDialogPresenter from 'in-settings/terms/dialog/TermsDialogPresenter.js';
import { saveTosPrivacyAgreement } from 'in-settings/api/saveTosPrivacyAgreement';
import connectTo from 'in-hoc/connectTo';
import { createLogger } from 'instalog';
import termsFormDefinition from '../termsFormDefinition';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { formUserSettingsObject } from '../termsAndPrivaySettings';

const logger = createLogger('in-settings/terms/dialog/TermsDialog');

export default connectTo(() => {
  const observables = {
    termsAndPrivacySettings: create().emit(window.instana.termsAndPrivacySettings)
  };
  return observables;
})(TermsDialog);

function TermsDialog({ termsAndPrivacySettings }) {
  const [saveError, setSaveError] = useState(false);
  const [form, setForm] = useState(termsFormDefinition(termsAndPrivacySettings));

  return termsAndPrivacySettings ? (
    <TermsDialogPresenter
      onSave={save(setSaveError)}
      saveError={saveError}
      unsetSaveError={() => setSaveError(false)}
      userSettings={termsAndPrivacySettings}
      onChange={onChange(setForm)}
      form={form}
    />
  ) : null;
}

function save(setSaveError) {
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

    saveTosPrivacyAgreement(tosPrivacyAgreement).once(
      response => response.status === 204 && window.location.reload(),
      error => {
        logger.error(`failed to save TosPrivacyAgreement: ${tosPrivacyAgreement} ${error.message}`, error);
        setSaveError(true);
      }
    );
  };
}

function onChange(setForm) {
  return (form, fieldName, fieldValue) => {
    setForm(form.updateIn([fieldName], field => field.setValue(fieldValue)));
  };
}
