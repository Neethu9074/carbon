import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { fromJS, List } from 'immutable';
import React from 'react';

import ConfigurationForm from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Configurations/ConfigurationForm';
import {
  queryValidationResultValidator,
  queryValidationInProgressValidator
} from 'in-views/configurationView/validation';
import { getAlertingConfig, saveAlertingConfig, createAlertingConfig } from 'in-api/alertingConfiguration';
import { teamSettingsAlertingConfigurations } from 'in-views/configurationView/navigation/paths';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import SaveCancel from 'in-views/configurationView/components/SaveCancel';
import Section from 'in-views/configurationView/components/Section';
import { queryValidator } from 'in-stores/search/validations';
import Notification from 'in-components/form/Notification';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';

export default function AlertingConfiguration(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title="Alerting Configuration"
      entityId={entityId}
      createDefaultEntity={createAlertingConfig}
      createForm={createForm}
      getEntityFromApi={getAlertingConfig}
      openEntities={() => goToPath(teamSettingsAlertingConfigurations)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function IntegrationForm(props) {
  const { form, message, error, loading, isCreate } = props;

  return (
    <div>
      <SubViewHeader>{isCreate ? 'Create' : 'Edit'} Alerting Configuration</SubViewHeader>

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <ConfigurationForm {...props} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        isCreate={isCreate}
        listPath={teamSettingsAlertingConfigurations}
      />
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
        value: config.getIn(['eventFilteringConfiguration', 'query'], '')
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
      'validationResult',
      createField({
        value: {
          valid: true,
          error: null
        },
        validator: queryValidationResultValidator
      })
    )
    .put(
      'queryValidationInProgress',
      createField({
        value: false,
        validator: queryValidationInProgressValidator
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
