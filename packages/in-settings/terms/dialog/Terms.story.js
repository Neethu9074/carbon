/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import termsFormDefinition, { addDynamicRoleField } from 'in-settings/terms/termsFormDefinition';
import TermsProgressIndicator from 'in-settings/terms/dialog/TermsProgressIndicator';
import TermsDialogPresenter from 'in-settings/terms/dialog/TermsDialogPresenter';
import TermsPageMessaging from 'in-settings/terms/dialog/TermsPageMessaging';
import TermsPageCookies from 'in-settings/terms/dialog/TermsPageCookies';
import TermsPageProfile from 'in-settings/terms/dialog/TermsPageProfile';

export default {
  component: TermsDialogPresenter
  // decorators: [action]
};

const userSettings = {
  allAnalyticsServices: false,
  walkmeAnalyticsServices: false,
  assistmeGuidanceServices: false,
  allSupportAndResearchServices: false,
  lastUpdated: 0,
  marketingMessages: false,
  productTips: false,
  testingGroup: false,
  userId: 'sakhjsgakhjgahj'
};

function onChange(setForm) {
  return (form, fieldName, fieldValue) => {
    let updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    if (fieldName === 'role') {
      updatedForm = addDynamicRoleField(updatedForm, window.instana.termsAndPrivacySettings);
    }

    setForm(updatedForm);
  };
}

export const Dialog = () => {
  const initialForm = termsFormDefinition(userSettings);
  const [form, setForm] = useState(initialForm);
  return (
    <TermsDialogPresenter
      onSave={action('onSwitchMetricPosition')}
      saveError={false}
      unsetSaveError={() => action('unsetSaveError')}
      onChange={(form, fieldName, fieldValue) =>
        setForm(form.updateIn([fieldName], field => field.setValue(fieldValue)))
      }
      form={form}
      userEmail="cesar@salad.de"
      userName="Cesar Salad"
    />
  );
};

export const FullDialog = () => {
  const [form, setForm] = useState(termsFormDefinition(userSettings));
  return (
    <TermsDialogPresenter
      onSave={action('onSwitchMetricPosition')}
      saveError={false}
      unsetSaveError={() => action('unsetSaveError')}
      onChange={onChange(setForm)}
      form={form}
      fullTermsConfigEnabled
      userEmail="cesar@salad.de"
      userName="Cesar Salad"
    />
  );
};

// value for fullTermsConfigEnabled is taken from feature flag in UI-Client
// import { fullTermsConfigEnabled } from 'in-services/featureFlags';
export const DialogOnPrem = () => {
  const [form, setForm] = useState(termsFormDefinition(userSettings));
  return (
    <TermsDialogPresenter
      onSave={action('onSwitchMetricPosition')}
      saveError={false}
      unsetSaveError={() => action('unsetSaveError')}
      onChange={onChange(setForm)}
      form={form}
      fullTermsConfigEnabled={false}
      userEmail="cesar@salad.de"
      userName="Cesar Salad"
    />
  );
};

export const ProgessIndicator = () => {
  return (
    <>
      <div>
        <TermsProgressIndicator pageNumber={1} nrPages={3} />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <TermsProgressIndicator pageNumber={2} nrPages={3} />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <TermsProgressIndicator pageNumber={3} nrPages={3} />
      </div>
    </>
  );
};

export const Page2 = () => {
  const [form, setForm] = useState(termsFormDefinition(userSettings));

  return (
    <div style={{ height: '520px', width: '650px' }}>
      <TermsPageMessaging form={form} onChange={onChange(setForm)} />
    </div>
  );
};

export const Page3 = () => {
  const [form, setForm] = useState(termsFormDefinition(userSettings));

  return (
    <div style={{ height: '520px', width: '650px' }}>
      <TermsPageCookies form={form} onChange={onChange(setForm)} />
    </div>
  );
};

export const Page4 = () => {
  const [form, setForm] = useState(termsFormDefinition(userSettings));

  return (
    <div style={{ height: '520px', width: '650px' }}>
      <TermsPageProfile form={form} onChange={onChange(setForm)} userEmail="cesar@salad.de" userName="Cesar Salad" />
    </div>
  );
};
