import { fromJS } from 'immutable';
import React from 'react';

import { getIntegration, saveIntegration, createIntegration } from 'in-services/api/integrations';
import BasicEntityOverview from 'in-views/configurationView/subview/BasicEntityOverview';
import { fullyQualified } from 'in-views/configurationView/subview/Integration/configs';
import { openIntegrations } from 'in-stores/navigation/configuration';
import { extractMatrix } from 'in-stores/navigation';

export default function Integration(props) {
  const matrix = extractMatrix(props.location.pathname);

  return (
    <BasicEntityOverview
      createEntity={() => createIntegration(null, matrix.kind)}
      title="Integration"
      defaultEntityTitle="Integration"
      getEntityTitle={entity => (entity ? `${fullyQualified[entity.get('kind')].label} Integration` : 'Integration')}
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
  return saveIntegration(fromJS(fullyQualified[integration.get('kind')].createEntity(integration, form)));
}

function createForm(config) {
  return fullyQualified[config.get('kind')].createForm(config);
}

function IntegrationForm(props) {
  const Form = fullyQualified[props.form.get('kind').value].Form;
  return <Form {...props} />;
}
