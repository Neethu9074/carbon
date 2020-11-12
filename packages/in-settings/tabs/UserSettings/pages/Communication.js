import { create } from 'reactive-observables';
import React from 'react';

import termsFormDefinition, { addDynamicRoleField } from 'in-settings/terms/termsFormDefinition';
import { setAndSave, formUserSettingsObject } from 'in-settings/terms/termsAndPrivaySettings';
import { success, error as errorType } from 'in-new-components/Message/types';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import ApiItemView from 'in-settings/components/ApiItemView';
import RolesSelector from 'in-settings/terms/RolesSelector';
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
      <Title title="Communication Settings" />
      <SubViewHeader>Control how we contact you, and for what purposes.</SubViewHeader>
      <SectionLine />
      <form className={locals.form}>
        <div className={locals.flexColumn}>
          {form.get('productTips').map(({ value }) => (
            <CheckboxFancy
              label="Product onboarding & success tips"
              checked={value}
              onChange={() => onChange('productTips', !value)}
              size="large"
            />
          ))}
          {form.get('marketingMessages').map(({ value }) => (
            <CheckboxFancy
              label="Marketing messages"
              checked={value}
              onChange={() => onChange('marketingMessages', !value)}
              size="large"
            />
          ))}
        </div>
        <div className={locals.role}>
          <RolesSelector form={form} onChange={onChange} />
        </div>
        <div className={locals.flexColumn}>
          <p>
            Help shape the future of Instana by participating in optional interviews and surveys with our product team.
          </p>
          {form.get('testingGroup').map(({ value }) => (
            <CheckboxFancy
              label="Join the User Testing Group"
              checked={value}
              onChange={() => onChange('testingGroup', !value)}
              size="large"
            />
          ))}
        </div>
      </form>
    </SettingsDetailPage>
  );
}

function saveItem({ form, setForm, setMessage, setLoading }) {
  if (form.get('dynamicRole') && !form.get('dynamicRole').valid) {
    setForm(form.updateIn(['dynamicRole'], field => field.setTouched(true)));
    return;
  }

  setLoading(true);

  setAndSave(
    formUserSettingsObject(form),
    () => {
      setMessage({ text: 'Settings successfully saved.', type: success });
      setLoading(false);
    },
    error => {
      setMessage({ text: `Failed to save settings: ${error.message}`, type: errorType });
      setLoading(false);
    }
  );
}

function enrichForm(form, { result }) {
  return termsFormDefinition(result.termsAndPrivacySettings, false);
}
