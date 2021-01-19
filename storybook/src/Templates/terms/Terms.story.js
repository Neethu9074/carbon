/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import TermsProgressIndicator from 'in-settings/terms/dialog/TermsProgressIndicator';
import TermsDialogPresenter from 'in-settings/terms/dialog/TermsDialogPresenter';
import termsFormDefinition from 'in-settings/terms/termsFormDefinition';
import TermsPage1 from 'in-settings/terms/dialog/TermsPage1';
import TermsPage2 from 'in-settings/terms/dialog/TermsPage2';

export default {
  title: 'Templates|terms/TermsDialog',
  component: TermsDialogPresenter
  // decorators: [action]
};

const userSettings = {
  allAnalyticsServices: true,
  allSupportAndResearchServices: true,
  lastUpdated: 0,
  marketingMessages: false,
  productTips: true,
  testingGroup: false,
  userId: 'sakhjsgakhjgahj'
};

function onChange(setForm) {
  return (form, fieldName, fieldValue) => {
    setForm(form.updateIn([fieldName], field => field.setValue(fieldValue)));
  };
}

export const Dialog = () => {
  const [form, setForm] = useState(termsFormDefinition(userSettings));
  return (
    <TermsDialogPresenter
      userSettings={userSettings}
      onSave={action('onSwitchMetricPosition')}
      saveError={false}
      unsetSaveError={() => action('unsetSaveError')}
      onChange={onChange(setForm)}
      form={form}
    />
  );
};

export const FullDialog = () => {
  const [form, setForm] = useState(termsFormDefinition(userSettings));
  return (
    <TermsDialogPresenter
      userSettings={userSettings}
      onSave={action('onSwitchMetricPosition')}
      saveError={false}
      unsetSaveError={() => action('unsetSaveError')}
      onChange={onChange(setForm)}
      form={form}
      fullTermsConfigEnabled
    />
  );
};

// value for fullTermsConfigEnabled is taken from feature flag in UI-Client
// import { fullTermsConfigEnabled } from 'in-services/featureFlags';
export const DialogOnPrem = () => {
  const [form, setForm] = useState(termsFormDefinition(userSettings));
  return (
    <TermsDialogPresenter
      userSettings={userSettings}
      onSave={action('onSwitchMetricPosition')}
      saveError={false}
      unsetSaveError={() => action('unsetSaveError')}
      onChange={onChange(setForm)}
      form={form}
      fullTermsConfigEnabled={false}
    />
  );
};

export const ProgessIndicator = () => {
  return (
    <>
      <div>
        <TermsProgressIndicator />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <TermsProgressIndicator pageNumber={2} />
      </div>
      ,
    </>
  );
};

export const Page1 = () => {
  const [form, setForm] = useState(termsFormDefinition(userSettings));
  return (
    <div style={{ height: '515px', width: '650px' }}>
      <TermsPage1 form={form} onChange={onChange(setForm)} />
    </div>
  );
};

export const Page2 = () => {
  const [form, setForm] = useState(termsFormDefinition(userSettings));
  return (
    <div style={{ height: '515px', width: '650px' }}>
      <TermsPage2 form={form} onChange={onChange(setForm)} hasErrorOnSave />
    </div>
  );
};
