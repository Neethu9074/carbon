import React from 'react';

import Section from 'in-views/configurationView/components/Section';
import { getIntegrationsByIds } from 'in-services/api/integrations';
import { getHealthRulesByIds } from 'in-services/api/healthRules';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';

import './AlertingConfigurationForm.less';

// const block = 'in-alerting-config-form';

export default connectTo(
  props => {
    const connectedHealthRules = props.form.get('ruleIds').value;
    const connectedIntegrations = props.form.get('integrationIds').value;

    return {
      integrations: getIntegrationsByIds(connectedIntegrations),
      healthRules: getHealthRulesByIds(connectedHealthRules)
    };
  },
  function AlertingConfigurationForm({ healthRules, integrations }) {
    if (!healthRules || !integrations) {
      return <LoadingIndicator type="dark" />;
    }

    return (
      <fieldset>
        <Section>form</Section>
      </fieldset>
    );
  }
);
