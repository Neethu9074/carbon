import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { fromJS, List } from 'immutable';
import React from 'react';

import {
  parseQuery,
  scopeApplication,
  scopeEverything,
  scopeDfq,
  serializeQuery
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import { queryValidationResultValidator, queryValidationInProgressValidator, valid } from 'in-settings/validation';
import EventFilterForm from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/EventFilters/EventFilterForm';
import { getAlertingConfig, saveAlertingConfig, createAlertingConfig } from 'in-api/alertingConfiguration';
import { teamSettingsAlertingEventFilters } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { queryValidator } from 'in-stores/search/validations';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';

export default function EventFilter(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title="Alert"
      entityId={entityId}
      createDefaultEntity={createAlertingConfig}
      createForm={config => createForm(config, !entityId)}
      getEntityFromApi={getAlertingConfig}
      openEntities={() => goToPath(teamSettingsAlertingEventFilters)}
      saveEntity={save}
    />
  );
}

const Form = entityForm(function DetailsForm(props) {
  const { form, message, error, loading, isCreate } = props;

  return (
    <SettingsDetailPage>
      <SubViewHeader>{isCreate ? 'Create' : 'Edit'} Alert</SubViewHeader>

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <EventFilterForm onChangeApplyOn={onChangeApplyOn} {...props} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        isCreate={isCreate}
        listPath={teamSettingsAlertingEventFilters}
      />
    </SettingsDetailPage>
  );
});

function save(config, form) {
  const query = serializeQuery(form);

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

  if (applyOn === scopeDfq) {
    updatedForm = updatedForm.remove('application');
    updatedForm = putQueryFields(updatedForm, '');
  } else if (applyOn === scopeApplication) {
    updatedForm = removeQueryFields(updatedForm);
    updatedForm = putApplicationField(updatedForm, null);
  } else if (applyOn === scopeEverything) {
    updatedForm = removeQueryFields(updatedForm);
    updatedForm = updatedForm.remove('application');
  }

  return updatedForm;
}

function createForm(config, isCreate) {
  const query = config.getIn(['eventFilteringConfiguration', 'query'], '');

  const { applyOn, applicationName } = isCreate ? { applyOn: null, applicationName: null } : parseQuery(query);

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

  if (applyOn === scopeDfq) {
    form = putQueryFields(form, query);
  } else if (applyOn === scopeApplication) {
    form = putApplicationField(form, applicationName);
  }

  return form;
}

export function putQueryFields(form, query) {
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

export function removeQueryFields(form) {
  return form
    .remove('query')
    .remove('validationResult')
    .remove('queryValidationInProgress');
}

export function putApplicationField(form, applicationName) {
  return form.put(
    'application',
    createField({
      value: applicationName,
      validator: notBlankValidator
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
