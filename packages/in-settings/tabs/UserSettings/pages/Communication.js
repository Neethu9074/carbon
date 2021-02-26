/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { create } from '@instana/observables';
import { t } from 'in-i18n';
import React from 'react';

import termsFormDefinition, { addDynamicRoleField } from 'in-settings/terms/termsFormDefinition';
import { setAndSave, formUserSettingsObject } from 'in-settings/terms/termsAndPrivaySettings';
import { success, neutral, error as errorType } from 'in-new-components/Message/types';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import MarketingMessageBox from 'in-settings/terms/MarketingMessageBox';
import { fullTermsConfigEnabled } from 'in-services/featureFlags';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import ApiItemView from 'in-settings/components/ApiItemView';
import RolesSelector from 'in-settings/terms/RolesSelector';
import Stack from 'in-new-components/layout/Stack/Stack';
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

function render({ form, setForm, termsAndPrivacySettings, setCanSaveItem }) {
  const onChange = (fieldName, fieldValue) => {
    let updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    if (fieldName === 'role') {
      updatedForm = addDynamicRoleField(updatedForm, termsAndPrivacySettings);
    }
    setForm(updatedForm);
    setCanSaveItem(true);
  };

  return (
    <SettingsDetailPage>
      <Title title={t('in-settings:tabs.communicationSettings')} />
      <SubViewHeader>{t('in-settings:tabs.controlForWhatPurposesWeContactYou')}</SubViewHeader>
      <SectionLine />
      <Stack>
        {form.get('productTips').map(({ value }) => (
          <CheckboxFancy
            label={t('in-settings:tabs.productOnboardingSuccessTips')}
            explanation={t('in-settings:tabs.toHelpYouMakeTheMostOfInstanaProducts')}
            checked={value}
            onChange={() => onChange(form, 'productTips', !value)}
            size="large"
          />
        ))}
        {form.get('marketingMessages').map(({ value }) => (
          <CheckboxFancy
            label={t('in-settings:tabs.marketingMessages')}
            explanation={t('in-settings:tabs.relatedToInstanaProductsServicesAndOfferings')}
            checked={value}
            onChange={() => onChange(form, 'marketingMessages', !value)}
            size="large"
          />
        ))}
        {fullTermsConfigEnabled &&
          form
            .get('testingGroup')
            .map(({ value }) => (
              <CheckboxFancy
                label={t('in-settings:tabs.userTestingGroup')}
                explanation={t('in-settings:tabs.toParticipateInOptionalInterviewsAndSurveyWithOurProductTeam')}
                checked={value}
                onChange={() => onChange(form, 'testingGroup', !value)}
                size="large"
              />
            ))}
      </Stack>

      <MarketingMessageBox />

      <div className={locals.role}>
        <RolesSelector form={form} onChange={onChange} />
      </div>
    </SettingsDetailPage>
  );
}

function saveItem({ form, setForm, setMessage }) {
  if (form.get('dynamicRole') && !form.get('dynamicRole').valid) {
    setForm(form.updateIn(['dynamicRole'], field => field.setTouched(true)));
    return;
  }

  setMessage({
    message: t('in-settings:tabs.savingPrivacySettings'),
    type: neutral,
    isSaving: true
  });

  setAndSave(
    formUserSettingsObject(form),
    () =>
      setMessage({
        text: t('in-settings:tabs.settingsSuccessfullySaved'),
        type: success
      }),
    error => setMessage({ text: t('in-settings:tabs.failedToSaveSettings', { err: error.message }), type: errorType })
  );
}

function enrichForm(form, { result }) {
  return termsFormDefinition(result.termsAndPrivacySettings, false);
}
