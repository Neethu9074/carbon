import { create } from '@instana/observables';
import React from 'react';

import { setAndSave, formUserSettingsObject } from 'in-settings/terms/termsAndPrivaySettings';
import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import termsFormDefinition from 'in-settings/terms/termsFormDefinition';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import ApiItemView from 'in-settings/components/ApiItemView';
import Title from 'in-components/Title';

import locals from './termsAndPrivacyPages.mless';

export default function Communication() {
  return (
    <ApiItemView
      getObservables={() => ({
        termsAndPrivacySettings: create().emit({ data: window.instana.termsAndPrivacySettings })
      })}
      enrichForm={enrichForm}
      saveItem={saveItem}
      render={render}
    />
  );
}

function render({ form, setForm, setCanSaveItem }) {
  const onChange = (fieldName, fieldValue) => {
    const updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    setForm(updatedForm);
    setCanSaveItem(true);
  };

  return (
    <SettingsDetailPage>
      <Title title="Privacy Settings" />
      <SubViewHeader>Set your preferences for third-party services below.</SubViewHeader>
      <SectionLine />
      <form className={locals.form}>
        {form.get('allAnalyticsServices').map(({ value }) => (
          <CheckboxFancy
            label="Allow Mixpanel Analytics"
            checked={value}
            onChange={() => onChange('allAnalyticsServices', !value)}
            size="large"
          />
        ))}
        {form.get('allSupportAndResearchServices').map(({ value }) => (
          <CheckboxFancy
            label="Allow all Support & Research Services (ZenDesk Chat & Appcues)"
            checked={value}
            onChange={() => onChange('allSupportAndResearchServices', !value)}
            size="large"
          />
        ))}
      </form>
    </SettingsDetailPage>
  );
}

function saveItem({ form, setMessage }) {
  setMessage({ message: 'Saving privacy settings', type: neutral, isSaving: true });
  setAndSave(
    formUserSettingsObject(form),
    () => setMessage({ text: 'Settings successfully saved.', type: success }),
    error => setMessage({ text: `Failed to save settings: ${error.message}`, type: errorType })
  );
}

function enrichForm(form, { result }) {
  return termsFormDefinition(result.termsAndPrivacySettings, false);
}
