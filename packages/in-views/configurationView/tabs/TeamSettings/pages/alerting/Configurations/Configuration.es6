import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { fromJS, List } from 'immutable';
import React from 'react';

import ConfigurationForm from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Configurations/ConfigurationForm';
import {
  queryValidationResultValidator,
  queryValidationInProgressValidator,
  valid
} from 'in-views/configurationView/validation';
import { getAlertingConfig, saveAlertingConfig, createAlertingConfig } from 'in-api/alertingConfiguration';
import { teamSettingsAlertingConfigurations } from 'in-views/configurationView/navigation/paths';
import SettingsDetailPage from 'in-views/configurationView/components/SettingsDetailPage';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import SaveCancel from 'in-views/configurationView/components/SaveCancel';
import Section from 'in-views/configurationView/components/Section';
import { queryValidator } from 'in-stores/search/validations';
import Notification from 'in-components/form/Notification';
import { isNotBlank } from 'in-services/util/string';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';

export default function AlertingConfiguration(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title="Alerting Configuration"
      entityId={entityId}
      createDefaultEntity={createAlertingConfig}
      createForm={config => createForm(config, !entityId)}
      getEntityFromApi={getAlertingConfig}
      openEntities={() => goToPath(teamSettingsAlertingConfigurations)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function IntegrationForm(props) {
  const { form, message, error, loading, isCreate } = props;

  return (
    <SettingsDetailPage>
      <SubViewHeader>{isCreate ? 'Create' : 'Edit'} Alerting Configuration</SubViewHeader>

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <ConfigurationForm onChangeApplyOn={onChangeApplyOn} {...props} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        isCreate={isCreate}
        listPath={teamSettingsAlertingConfigurations}
      />
    </SettingsDetailPage>
  );
});

function save(config, form) {
  // the query field might not exist in case 'Apply on ALL' is selected,
  // which corresponds to an empty query
  const query = form.containsKey('query') ? form.get('query').value : '';

  return saveAlertingConfig(
    fromJS(
      createAlertingConfig(
        config ? config.get('id') : null,
        form.get('name').value,
        form.get('muteUntil').value,
        form.get('integrationIds').value.toJS(),
        form.get('ruleIds').value.toJS(),
        query,
        form.get('eventQuery').value,
        form.get('eventTypes').value
      )
    )
  );
}

function onChangeApplyOn(form, applyOn) {
  if (!applyOn) {
    return;
  }
  let updatedForm = form.updateIn(['applyOn'], field => field.setValue(applyOn).setTouched(true));
  if (applyOn === 'all') {
    updatedForm = updatedForm.remove('query');
  } else {
    updatedForm = putQueryFields(updatedForm, '');
  }
  return updatedForm;
}

function createForm(config, isCreate) {
  const query = config.getIn(['eventFilteringConfiguration', 'query'], '');
  // always set to 'Dynamic Focus Query' per default for new configs, so that
  // the user manually has to select 'All' in case he really want that
  const applyOn = isCreate || isNotBlank(query) ? 'dfq' : 'all';

  let form = createMapForm()
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
    )
    .put(
      'applyOn',
      createField({
        value: applyOn,
        validator: notBlankValidator
      })
    );

  if (applyOn === 'dfq') {
    form = putQueryFields(form, query);
  }

  return form;
}

function putQueryFields(form, query) {
  let updatedForm = form.put(
    'query',
    createField({
      value: query,
      validator: notBlankValidator
    })
  );
  updatedForm = updatedForm.put(
    'validationResult',
    createField({
      value: valid(),
      validator: queryValidationResultValidator
    })
  );
  updatedForm = updatedForm.put(
    'queryValidationInProgress',
    createField({
      value: false,
      validator: queryValidationInProgressValidator
    })
  );
  return updatedForm;
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
