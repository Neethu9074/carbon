/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { create } from '@instana/observables';

//@ts-expect-error need ts migration
import { setAndSave, formUserSettingsObject } from 'in-settings/terms/termsAndPrivaySettings';
//@ts-expect-error need ts migration
import termsFormDefinition from 'in-settings/terms/termsFormDefinition';
//@ts-expect-error need ts migration
import ApiItemView from 'in-settings/components/ApiItemView';
import { SaveItemProps, PrivacyProps } from 'in-settings/tabs/UserSettings/pages/privacyTypes';
import ExpandableCookieList from 'in-settings/terms/cookies/ExpandableCookieList';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
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

function render({ form, setForm, setCanSaveItem }: PrivacyProps) {
  const onChange = (fieldName: string, fieldValue: string | boolean) => {
    const updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    setForm(updatedForm);
    setCanSaveItem(true);
  };

  return (
    <SettingsDetailPage>
      <Title title={t('in-settings:tabs.privacySettings')} />
      <SubViewHeader>{t('in-settings:tabs.manageYourPreferences')}</SubViewHeader>
      <SectionLine />
      <ExpandableCookieList
        form={form}
        onChange={
          //@ts-expect-error form is not used but needed
          (form, key, value) => onChange(key, value)
        }
      />
    </SettingsDetailPage>
  );
}

function saveItem({ form, setMessage }: SaveItemProps) {
  setMessage({
    message: t('in-settings:tabs.savingPrivacySettings'),
    type: 'neutral',
    isSaving: true
  });
  setAndSave(
    formUserSettingsObject(form),
    () => {
      setMessage({
        text: t('in-settings:tabs.settingsSuccessfullySaved'),
        type: 'success'
      });
      // Reloading to remove/add AssistMe an WalkMe scripts present in index.hbs
      window.location.reload();
    },
    (error: Error) =>
      setMessage({ text: t('in-settings:tabs.failedToSaveSettings', { err: error.message }), type: 'error' })
  );
}

//@ts-expect-error form is not used but needed
function enrichForm(form: MapForm<any>, { result }: { result: Record<string, any> }) {
  return termsFormDefinition(result.termsAndPrivacySettings);
}
