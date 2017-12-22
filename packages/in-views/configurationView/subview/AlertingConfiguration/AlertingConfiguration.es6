import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { fromJS, List } from 'immutable';
import React from 'react';

import AlertingConfigurationForm from 'in-views/configurationView/subview/AlertingConfiguration/AlertingConfigurationForm';
import { getAlertingConfig, saveAlertingConfig, createAlertingConfig } from 'in-api/alertingConfiguration';
import { alertingConfigurationPath } from 'in-stores/navigation/paths/settingPaths';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import { queryValidator } from 'in-stores/search/validations';
import Notification from 'in-components/form/Notification';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';
import Button from 'in-components/Button';

export default function AlertingConfiguration(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title="Alerting Configuration"
      entityId={entityId}
      createDefaultEntity={createAlertingConfig}
      createForm={createForm}
      getEntityFromApi={getAlertingConfig}
      openEntities={() => goToPath(alertingConfigurationPath)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function IntegrationForm(props) {
  const { form, message, error, loading } = props;

  return (
    <div>
      <SubViewHeader>Alerting Configuration</SubViewHeader>

      <Section>
        <Button kind="success" type="submit" disabled={!form.hierarchyValid && form.touched}>
          Save
        </Button>

        {message ? (
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        ) : null}
      </Section>

      <AlertingConfigurationForm {...props} />
    </div>
  );
});

function save(config, form) {
  return saveAlertingConfig(
    fromJS(
      createAlertingConfig(
        config ? config.get('id') : null,
        form.get('name').value,
        form.get('muteUntil').value,
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
  // const isAdvancedMode =
  //   (config.getIn(['eventFilteringConfiguration', 'eventQuery'], '') ? true : false) ||
  //   config.getIn(['eventFilteringConfiguration', 'ruleIds'], List()).size > 0;

  const isAdvancedMode = config.getIn(['eventFilteringConfiguration', 'query'], '') ? true : false;

  return createMapForm()
    .put(
      'advancedMode',
      createField({
        value: isAdvancedMode
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
      'muteUntil',
      createField({
        value: config.get('muteUntil')
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
        value: config.getIn(['eventFilteringConfiguration', 'eventTypes'], List(['incident', 'critical'])),
        validator: eventTypeValidator
      })
    )
    .put(
      'matchingEntities',
      createField({
        value: null
      })
    )
    .put(
      'timeOpened',
      createField({
        value: Date.now()
      })
    );
}
function eventTypeValidator(eventType) {
  if (eventType.size === 0) {
    return [
      {
        severity: 'error',
        message: `Please select at least one event type`
      }
    ];
  }
}
