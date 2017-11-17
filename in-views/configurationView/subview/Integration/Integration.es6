import { fromJS } from 'immutable';
import React from 'react';

import createOffice365IntegrationForm from 'in-views/configurationView/subview/Integration/office365IntegrationForm';
import createEmailIntegrationForm from 'in-views/configurationView/subview/Integration/emailIntegrationForm';
import { getIntegration, saveIntegration, createIntegration } from 'in-services/api/integrations';
import BasicEntityOverview from 'in-views/configurationView/subview/BasicEntityOverview';
import { openIntegrations } from 'in-stores/navigation/configuration';

const forms = {
  email: createEmailIntegrationForm,
  office365: createOffice365IntegrationForm
};

export default function Integration(props) {
  return (
    <BasicEntityOverview
      createEntity={createIntegration}
      title="Integration"
      entityTitle="integration"
      createForm={createForm}
      getEntity={getIntegration}
      openEntities={openIntegrations}
      save={save}
      Form={IntegrationForm}
      {...props}
    />
  );
}

function save(integration, form) {
  return saveIntegration(fromJS(forms[integration.get('kind')].createEntity(integration, form)));
}

function createForm(config) {
  return forms[config.get('kind')].createForm();
}

function IntegrationForm(props) {
  const Form = forms[props.form.get('kind').value].Form;
  return <Form {...props} />;
}
