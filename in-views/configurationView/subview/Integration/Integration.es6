import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { fromJS } from 'immutable';
import React from 'react';

import { getIntegration, saveIntegration, createIntegration } from 'in-services/api/integrations';
import IntegrationForm from 'in-views/configurationView/subview/Integration/IntegrationForm';
import BasicEntityOverview from 'in-views/configurationView/subview/BasicEntityOverview';
import { openIntegration } from 'in-stores/navigation/configuration';

export default function Integration(props) {
  return (
    <BasicEntityOverview
      createEntity={createIntegration}
      title="Integration"
      entityTitle="integration"
      createForm={createForm}
      getEntity={getIntegration}
      openEntities={openIntegration}
      save={save}
      Form={IntegrationForm}
      {...props}
    />
  );
}

function save(config, form) {
  return saveIntegration(
    fromJS(createIntegration(config ? config.get('id') : null, form.get('kind').value, form.get('configuration').value))
  );
}

function createForm(config) {
  return createMapForm()
    .put(
      'kind',
      createField({
        value: config.get('kind'),
        validator: notBlankValidator
      })
    )
    .put(
      'configuration',
      createField({
        value: config.get('configuration')
      })
    );
}
