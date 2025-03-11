/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import termsFormDefinition, { addDynamicRoleField } from 'in-settings/terms/termsFormDefinition';
import TermsDialogPresenter from 'in-settings/terms/dialog/TermsDialogPresenter';
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
      userEmail="cesar@salad.de"
      userName="Cesar Salad"
    />
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
