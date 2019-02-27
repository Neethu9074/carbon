import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { fromJS, List } from 'immutable';
import React from 'react';

import {
  parseQuery,
  scopeApplication,
  scopeDfq,
  serializeQuery
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import {
  modeEventTypes,
  modeSelectedEvents
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/EventFilters/components/Step2';
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
      createForm={alertEntity => createForm(alertEntity, !entityId)}
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
      <SubViewHeader>{isCreate ? 'Create New' : 'Edit'} Alert</SubViewHeader>

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <EventFilterForm
        onChangeApplyOn={onChangeApplyOn}
        onChangeEventSelectionMode={onChangeEventSelectionMode}
        {...props}
      />

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

function createForm(alertEntity, isCreate) {
  let eventTypes = alertEntity.getIn(['eventFilteringConfiguration', 'eventTypes'], List([]));
  if (eventTypes == null) {
    // Can be null even though we provide a fallback to getIn, when it is present as null in the back end payload.
    eventTypes = List([]);
  }
  let selectedEvents = alertEntity.getIn(['eventFilteringConfiguration', 'ruleIds'], List([]));
  if (selectedEvents == null) {
    // Can be null even though we provide a fallback to getIn, when it is present as null in the back end payload.
    selectedEvents = List([]);
  }

  let eventSelectionMode;
  if (!selectedEvents.isEmpty()) {
    eventSelectionMode = modeSelectedEvents;
  } else if (!eventTypes.isEmpty()) {
    eventSelectionMode = modeEventTypes;
  }

  const query = alertEntity.getIn(['eventFilteringConfiguration', 'query'], '');
  const { applyOn, applicationName } = isCreate ? { applyOn: null, applicationName: null } : parseQuery(query);

  let form = createMapForm()
    .put(
      'name',
      createField({
        value: alertEntity.get('alertName'),
        validator: notBlankValidator
      })
    )
    .put(
      'muteUntil',
      createField({
        value: alertEntity.get('muteUntil')
      })
    )
    .put(
      'selectedAlertChannels',
      createField({
        value: alertEntity.get('integrationIds', List())
      })
    )
    .put(
      'eventQuery',
      createField({
        value: alertEntity.getIn(['eventFilteringConfiguration', 'eventQuery'], ''),
        validator: queryValidator
      })
    )
    .put(
      'eventSelectionMode',
      createField({
        value: eventSelectionMode,
        validator: notBlankValidator
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

  if (eventSelectionMode === modeEventTypes) {
    form = putEventTypesField(form, eventTypes);
  } else if (eventSelectionMode === modeSelectedEvents) {
    form = putSelectedEventsField(form, selectedEvents);
  }

  if (applyOn === scopeDfq) {
    form = putQueryFields(form, query);
  } else if (applyOn === scopeApplication) {
    form = putApplicationField(form, applicationName);
  }

  return form;
}

export function putEventTypesField(form, eventTypes) {
  return form.put(
    'eventTypes',
    createField({
      value: eventTypes ? eventTypes : List([]),
      validator: eventTypeValidator
    })
  );
}

export function putSelectedEventsField(form, selectedEvents) {
  return form.put(
    'selectedEvents',
    createField({
      value: selectedEvents ? selectedEvents : List([]),
      validator: selectedEventsValidator
    })
  );
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

function onChangeEventSelectionMode(form, eventSelectionMode) {
  if (!eventSelectionMode) {
    return;
  }
  let updatedForm = form.updateIn(['eventSelectionMode'], field => field.setValue(eventSelectionMode).setTouched(true));

  if (eventSelectionMode === modeEventTypes) {
    updatedForm = updatedForm.remove('selectedEvents');
    updatedForm = putEventTypesField(updatedForm);
  } else if (eventSelectionMode === modeSelectedEvents) {
    updatedForm = updatedForm.remove('eventTypes');
    updatedForm = putSelectedEventsField(updatedForm);
  } else {
    updatedForm = updatedForm.remove('selectedEvents');
    updatedForm = updatedForm.remove('eventTypes');
  }

  return updatedForm;
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
  } else {
    // scope "everything" or no apply-on value selected
    updatedForm = removeQueryFields(updatedForm);
    updatedForm = updatedForm.remove('application');
  }

  return updatedForm;
}

function eventTypeValidator(eventType) {
  if (eventType.size === 0) {
    return [
      {
        severity: 'error',
        message: `Please select at least one event type.`
      }
    ];
  }
}

function selectedEventsValidator(selectedEvents) {
  if (selectedEvents.size === 0) {
    return [
      {
        severity: 'error',
        message: `Please select at least one event.`
      }
    ];
  }
}

function save(alertEntity, form) {
  const query = serializeQuery(form);
  const eventSelectionMode = form.get('eventSelectionMode').value;

  return saveAlertingConfig(
    fromJS(
      createAlertingConfig(
        alertEntity ? alertEntity.get('id') : null,
        form.get('name').value,
        form.get('muteUntil').value,
        form.get('selectedAlertChannels').value.toJS(),
        eventSelectionMode === modeSelectedEvents && form.get('selectedEvents')
          ? form.get('selectedEvents').value.toJS()
          : null,
        query,
        form.get('eventQuery').value,
        eventSelectionMode === modeEventTypes && form.get('eventTypes') ? form.get('eventTypes').value : null
      )
    )
  );
}
