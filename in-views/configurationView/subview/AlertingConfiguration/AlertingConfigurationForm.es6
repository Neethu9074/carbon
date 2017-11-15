import React from 'react';

import Section from 'in-views/configurationView/components/Section';
import { getHealthRules } from 'in-services/api/healthRules';
import connectTo from 'in-hoc/connectTo';

import './AlertingConfigurationForm.less';

// const block = 'in-alerting-config-form';

export default connectTo(
  {
    healthRules: getHealthRules()
  },
  function AlertingConfigurationForm(/* { healthRules, form, onChange } */) {
    // healthRules = healthRules || [];

    return (
      <fieldset>
        <Section>form</Section>
      </fieldset>
    );
  }
);
