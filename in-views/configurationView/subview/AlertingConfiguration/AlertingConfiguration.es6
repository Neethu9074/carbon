import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { fromJS, List } from 'immutable';
import React from 'react';

import AlertingConfigurationForm from 'in-views/configurationView/subview/AlertingConfiguration/AlertingConfigurationForm';
import { getAlertingConfig, saveAlertingConfig, createAlertingConfig } from 'in-services/api/alertingConfiguration';
import BasicEntityOverview from 'in-views/configurationView/subview/BasicEntityOverview';
import { openAlertingConfigurations } from 'in-stores/navigation/configuration';
import { queryValidator } from 'in-stores/search/validations';

export default function AlertingConfiguration(props) {
  return (
    <BasicEntityOverview
      createEntity={createAlertingConfig}
      title="AlertingConfiguration"
      entityTitle="alerting configuration"
      createForm={createForm}
      getEntity={getAlertingConfig}
      openEntities={openAlertingConfigurations}
      save={save}
      Form={AlertingConfigurationForm}
      {...props}
    />
  );
}

function save(config, form) {
  return saveAlertingConfig(
    fromJS(
      createAlertingConfig(
        config ? config.get('id') : null,
        form.get('name').value,
        form.get('integrationIds').value.toJS(),
        form.get('ruleIds').value.toJS(),
        form.get('query').value,
        form.get('eventQuery').value,
        form.get('eventTypes').value
      )
    )
  );
}

function createForm(config) {
  return createMapForm()
    .put(
      'advancedMode',
      createField({
        value: config.getIn(['eventFilteringConfiguration', 'eventQuery'], '') ? true : false
      })
    )
    .put(
      'name',
      createField({
        value: config.get('alertName'),
        validator: notBlankValidator
      })
    )
    .put(
      'integrationIds',
      createField({
        value: config.get('integrationIds', List())
      })
    )
    .put(
      'query',
      createField({
        value: config.getIn(['eventFilteringConfiguration', 'query'], ''),
        validator: queryValidator
      })
    )
    .put(
      'eventQuery',
      createField({
        value: config.getIn(['eventFilteringConfiguration', 'eventQuery'], ''),
        validator: queryValidator
      })
    )
    .put(
      'ruleIds',
      createField({
        value: config.getIn(['eventFilteringConfiguration', 'ruleIds'], List())
      })
    )
    .put(
      'eventTypes',
      createField({
        value: config.getIn(['eventFilteringConfiguration', 'eventTypes'], List(['incident', 'critical']))
      })
    )
    .put(
      'matchingEntities',
      createField({
        value: { snapshots: [] }
      })
    );
}
