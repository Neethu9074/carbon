import { create } from 'reactive-observables';
import React, { useState } from 'react';

import { setAndSave, formUserSettingsObject } from 'in-settings/terms/termsAndPrivaySettings';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import termsFormDefinition from 'in-settings/terms/termsFormDefinition';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import evaluateClassNames from 'in-services/util/classnames';
import ComboBox from 'in-components/ComboBox/ComboBox';
import { roles } from 'in-settings/terms/rolesConfig';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import locals from './termsAndPrivacyPages.mless';

export default connectTo(() => {
  const observables = {
    termsAndPrivacySettings: create().emit(window.instana.termsAndPrivacySettings)
  };
  return observables;
})(Communication);

function Communication({ termsAndPrivacySettings }) {
  const [form, setForm] = useState(termsFormDefinition(termsAndPrivacySettings, false));
  const [error, setError] = useState(false);

  const onChange = (fieldName, fieldValue) => {
    const updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    setForm(updatedForm);
    setAndSave(formUserSettingsObject(updatedForm), () => setError(true));
  };

  return (
    <SettingsDetailPage>
      <Title title="Communication Settings" />
      <SubViewHeader>Control how we contact you, and for what purposes.</SubViewHeader>
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
          <p>What role is closest to your role in your organisation?</p>
          {form.get('role').map(({ value }) => (
            <ComboBox
              className={locals.comboBox}
              name="role"
              value={value}
              options={roles}
              onChange={e => onChange('role', e.value || '')}
              searchable
            />
          ))}
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
        <div
          className={evaluateClassNames({
            [locals.errorText]: true,
            [locals.hidden]: !error
          })}
        >
          <SvgIcon className={locals.icon} type="lib_help_error_error_circle" size="s" />
          <span>Sorry, we couldn&apos;t save your preferences right now. Please try again.</span>
        </div>
      </form>
    </SettingsDetailPage>
  );
}
