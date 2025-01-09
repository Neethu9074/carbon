/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { create } from '@instana/observables';

import { setAndSave, formUserSettingsObject } from 'in-settings/terms/termsAndPrivaySettings';
import { isWalkmeScriptLoaded } from 'in-settings/terms/stores/termsAndPrivacySettingsStore';
import ExpandableCookieList from 'in-settings/terms/cookies/ExpandableCookieList';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import termsFormDefinition from 'in-settings/terms/termsFormDefinition';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import ApiItemView from 'in-settings/components/ApiItemView';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

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
      <Title title={t('in-settings:tabs.privacySettings')} />
      <SubViewHeader>{t('in-settings:tabs.setYourPreferencesForThirdPartyServicesBelow')}</SubViewHeader>
      <SectionLine />

      <ExpandableCookieList form={form} onChange={(form, key, value) => onChange(key, value)} />
    </SettingsDetailPage>
  );
}

function saveItem({ form, setMessage }) {
  setMessage({
    message: t('in-settings:tabs.savingPrivacySettings'),
    type: 'neutral',
    isSaving: true
  });
  setAndSave(
    formUserSettingsObject(form),
    () => {
      const { walkmeAnalyticsServices } = window.instana.termsAndPrivacySettings;
      if (walkmeAnalyticsServices && !isWalkmeScriptLoaded) {
        window.location.reload();
      } else {
        setMessage({
          text: t('in-settings:tabs.settingsSuccessfullySaved'),
          type: 'success'
        });
      }
    },
    error => setMessage({ text: t('in-settings:tabs.failedToSaveSettings', { err: error.message }), type: 'error' })
  );
}

function enrichForm(form, { result }) {
  return termsFormDefinition(result.termsAndPrivacySettings);
}
