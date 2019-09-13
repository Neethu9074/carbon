import { create } from 'reactive-observables';
import React, { useState } from 'react';

import { setAndSave, formUserSettingsObject } from 'in-settings/terms/termsAndPrivaySettings';
import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import termsFormDefinition from 'in-settings/terms/termsFormDefinition';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import evaluateClassNames from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import locals from './termsAndPrivacyPages.mless';

export default connectTo(() => {
  const observables = {
    termsAndPrivacySettings: create().emit(window.instana.termsAndPrivacySettings)
  };
  return observables;
})(Privacy);

function Privacy({ termsAndPrivacySettings }) {
  const [form, setForm] = useState(termsFormDefinition(termsAndPrivacySettings, false));
  const [error, setError] = useState(false);

  const onChange = (fieldName, fieldValue) => {
    const updatedForm = form.updateIn([fieldName], field => field.setValue(fieldValue));
    setForm(updatedForm);
    setAndSave(formUserSettingsObject(updatedForm), () => setError(true));
  };

  return (
    <SettingsDetailPage>
      <Title title="Privacy Settings" />
      <SubViewHeader>Set your preferences for third-party services below.</SubViewHeader>
      <form className={locals.form}>
        {form.get('allAnalyticsServices').map(({ value }) => (
          <CheckboxFancy
            label="Allow all Analytics (Google Analytics & Mixpanel)"
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
