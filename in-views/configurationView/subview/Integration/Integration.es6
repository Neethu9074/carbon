import { fromJS } from 'immutable';
import React from 'react';

import { getIntegration, saveIntegration, createIntegration } from 'in-services/api/integrations';
import BasicEntityOverview from 'in-views/configurationView/subview/BasicEntityOverview';
import forms from 'in-views/configurationView/subview/Integration/forms';
import { openIntegrations } from 'in-stores/navigation/configuration';
import { extractMatrix } from 'in-stores/navigation';

export default function Integration(props) {
  const matrix = extractMatrix(props.location.pathname);

  return (
    <BasicEntityOverview
      createEntity={() => createIntegration(null, matrix.kind)}
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
  return forms[config.get('kind')].createForm(config);
}

function IntegrationForm(props) {
  const Form = forms[props.form.get('kind').value].Form;
  return <Form {...props} />;
}
