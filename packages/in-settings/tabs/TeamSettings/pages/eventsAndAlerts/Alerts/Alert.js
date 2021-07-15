/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withState, withHandlers } from 'recompose';
import { createMapForm, createField } from 'formalistic';
import { fromJS, List } from 'immutable';
import React from 'react';

import {
  modeEventTypes,
  modeSelectedEvents,
  modeSelectedSmartAlerts
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/Step2';
import {
  parseQuery,
  scopeApplication,
  scopeDfq,
  serializeQuery
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/shared';
import { createForm as createListFormForCustomPayloads } from 'in-alerting/components/CustomPayload/customPayloadFormUtil';
import { queryValidationResultValidator, queryValidationInProgressValidator, valid } from 'in-settings/validation';
import { getAlertingConfig, saveAlertingConfig, createAlertingConfig } from 'in-api/alertingConfiguration';
import AlertForm from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/AlertForm';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { teamSettingsAlertingAlerts } from 'in-settings/navigation/paths';
import { notBlankValidator } from 'in-services/validators/string';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import { submitAlertTracker } from 'in-settings/tracker';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import entityForm from 'in-hoc/entityForm';
import theme from 'in-themes';
import { t } from 'in-i18n';

export const limitForConnectedEvents = 1000;
export const limitForConnectedAlertChannels = 100;

export default function Alert(props) {
  const entityId = props.match.params.id;

  return (
    <Form
      title={t('in-settings:tabs.alert')}
      entityId={entityId}
      createDefaultEntity={createAlertingConfig}
      createForm={alertEntity => createForm(alertEntity, !entityId)}
      getEntityFromApi={getAlertingConfig}
      openEntities={() => goToPath(teamSettingsAlertingAlerts)}
      saveEntity={save}
    />
  );
}

function DetailsForm(props) {
  const { entity, form, message, error, loading, isCreate } = props;

  if (!entity || !form) {
    return <LoadingIndicator />;
  }

  if (entity && entity.get('errors')) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          {t('in-settings:tabs.unknownAlert')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          {entity.get('errors').get(0)}
          <br />
          {t('in-settings:tabs.ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  }

  return (
    <SettingsDetailPage>
      <SubViewHeader>{isCreate ? t('in-settings:tabs.createNewAlert') : t('in-settings:tabs.editAlert')}</SubViewHeader>
      <SectionLine />

      {message && (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      )}

      <AlertForm onChangeApplyOn={onChangeApplyOn} {...props} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        isCreate={isCreate}
        listPath={teamSettingsAlertingAlerts}
      />
    </SettingsDetailPage>
  );
}

const Form = entityForm(
  compose(
    withState('eventTypes', 'setEventTypes', null),
    withState('selectedEvents', 'setSelectedEvents', null),
    withState('applicationAlertConfigIds', 'setApplicationAlertConfigIds', null),
    withHandlers({
      onChangeEventSelectionMode: ({
        eventTypes,
        setEventTypes,
        selectedEvents,
        setSelectedEvents,
        applicationAlertConfigIds,
        setApplicationAlertConfigIds
      }) => (form, eventSelectionMode) => {
        let updatedForm = onChangeEventSelectionMode(form, eventSelectionMode);

        if (eventSelectionMode === modeSelectedEvents) {
          const eventTypes = form.get('eventTypes') ? form.get('eventTypes').value : null;
          setEventTypes(eventTypes);
          updatedForm = putSelectedEventsField(updatedForm, selectedEvents);
        }
        if (eventSelectionMode === modeEventTypes) {
          const selectedEvents = form.get('selectedEvents') ? form.get('selectedEvents').value : List([]);
          setSelectedEvents(selectedEvents);
          updatedForm = putEventTypesField(updatedForm, eventTypes);
        }
        if (eventSelectionMode === modeSelectedSmartAlerts) {
          const selectedApplicationAlertConfigs = form.get('applicationAlertConfigIds')?.value ?? List([]);
          setApplicationAlertConfigIds(selectedApplicationAlertConfigs);
          updatedForm = putSelectedSmartAlertsField(updatedForm, applicationAlertConfigIds);
          if (form.get('applyOn')?.value === scopeDfq) {
            updatedForm = onChangeApplyOn(updatedForm, scopeApplication);
          }
        }
        return updatedForm;
      }
    })
  )(DetailsForm)
);

function createForm(alertEntity, isCreate) {
  const eventTypes = alertEntity.getIn(['eventFilteringConfiguration', 'eventTypes'], List([])) ?? List([]);
  const selectedEvents = alertEntity.getIn(['eventFilteringConfiguration', 'ruleIds'], List([])) ?? List([]);
  const selectedApplicationAlertConfigs =
    alertEntity.getIn(['eventFilteringConfiguration', 'applicationAlertConfigIds'], List([])) ?? List([]);

  const eventSelectionMode = getEventSelectionMode(eventTypes, selectedApplicationAlertConfigs);

  const query = alertEntity.getIn(['eventFilteringConfiguration', 'query'], '');
  const { applyOn, applicationName, applicationIds } = isCreate
    ? { applyOn: null, applicationName: null, applicationIds: [] }
    : parseQuery(query);

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
        value: alertEntity.get('integrationIds', List()),
        validator: selectedAlertChannelsValidator
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
      'matchingEntitiesQueryInProgress',
      createField({
        value: false
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
    )
    .put(
      'customPayloadFields',
      createListFormForCustomPayloads(alertEntity.get('customPayloadFields', List([])).toJS(), false)
    );

  if (eventSelectionMode === modeEventTypes) {
    form = putEventTypesField(form, eventTypes);
  } else if (eventSelectionMode === modeSelectedEvents) {
    form = putSelectedEventsField(form, selectedEvents);
  } else if (eventSelectionMode === modeSelectedSmartAlerts) {
    form = putSelectedSmartAlertsField(form, selectedApplicationAlertConfigs);
  }

  if (applyOn === scopeDfq) {
    form = putQueryFields(form, query);
  } else if (applyOn === scopeApplication) {
    if (applicationName) {
      form = putApplicationField(form, applicationName);
      form = putApplicationIdField(form, []);
    } else {
      form = putApplicationIdField(form, applicationIds);
    }
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

export function putSelectedSmartAlertsField(form, selectedApplicationAlertIds) {
  return form.put(
    'applicationAlertConfigIds',
    createField({
      value: selectedApplicationAlertIds ?? List([]),
      validator: selectedApplicationAlertConfigsValidator
    })
  );
}

export function putQueryFields(form, query) {
  return form
    .put(
      'query',
      createField({
        value: query,
        validator: notBlankValidator
      })
    )
    .put(
      'validationResult',
      createField({
        value: valid(),
        validator: queryValidationResultValidator
      })
    )
    .put(
      'queryValidationInProgress',
      createField({
        value: false,
        validator: queryValidationInProgressValidator
      })
    );
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
      value: applicationName
    })
  );
}

export function putApplicationIdField(form, applicationIds) {
  return form.put(
    'applicationIds',
    createField({
      value: applicationIds ? applicationIds : [],
      validator: selectedApplicationsValidator
    })
  );
}
function onChangeEventSelectionMode(form, eventSelectionMode) {
  if (!eventSelectionMode) {
    return;
  }
  let updatedForm = form.updateIn(['eventSelectionMode'], field => field.setValue(eventSelectionMode).setTouched(true));

  updatedForm = updatedForm
    .remove('selectedEvents')
    .remove('eventTypes')
    .remove('applicationAlertConfigIds');
  if (eventSelectionMode === modeEventTypes) {
    updatedForm = putEventTypesField(updatedForm);
  } else if (eventSelectionMode === modeSelectedEvents) {
    updatedForm = putSelectedEventsField(updatedForm);
  } else if (eventSelectionMode === modeSelectedSmartAlerts) {
    updatedForm = putSelectedSmartAlertsField(updatedForm);
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
    updatedForm = putApplicationField(updatedForm, '');
    updatedForm = putApplicationIdField(updatedForm, []);
  } else {
    // scope "everything" or no apply-on value selected
    updatedForm = removeQueryFields(updatedForm);
    updatedForm = updatedForm.remove('application');
    updatedForm = updatedForm.remove('applicationIds');
  }

  return updatedForm;
}

function eventTypeValidator(eventType) {
  if (eventType.size === 0) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseSelectAtLeastOneEventType')
      }
    ];
  }
}

function selectedEventsValidator(selectedEvents) {
  if (selectedEvents.size === 0) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseSelectAtLeastOneEvent')
      }
    ];
  }
  if (selectedEvents.size > limitForConnectedEvents) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseSelectAtMostLimitForConnectedEventsEvents', {
          limitForConnectedEvents: limitForConnectedEvents
        })
      }
    ];
  }
}

function selectedApplicationAlertConfigsValidator(selectedApplicationAlertConfigs) {
  if (selectedApplicationAlertConfigs.size === 0) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseSelectAtLeastOneSmartAlert')
      }
    ];
  }
  if (selectedApplicationAlertConfigs.size > limitForConnectedEvents) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseSelectAtMostSmartAlerts', {
          limit: limitForConnectedEvents
        })
      }
    ];
  }
}

function selectedApplicationsValidator(selectedApplications) {
  if (selectedApplications.size === 0) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseSelectAtLeastOneApplication')
      }
    ];
  }
}

function selectedAlertChannelsValidator(selectedAlertChannels) {
  if (selectedAlertChannels.size > limitForConnectedAlertChannels) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.pleaseSelectAtMostLimitForConnectedAlertChannelsAlertChannels', {
          limitForConnectedAlertChannels: limitForConnectedAlertChannels
        })
      }
    ];
  }
}

function save(alertEntity, form) {
  const query = serializeQuery(form);
  const eventSelectionMode = form.get('eventSelectionMode').value;

  const selectedAlertChannels = form.get('selectedAlertChannels').value.toJS();
  const selectedEvents = form.get('selectedEvents')?.value?.toJS();
  const selectedApplicationAlertConfigs = form.get('applicationAlertConfigIds')?.value?.toJS();
  const selectedEventTypes = form.get('eventTypes')?.value;
  const scopeType = form.get('applyOn').value;

  submitAlertTracker({
    numOfAlertChannels: selectedAlertChannels.length,
    numOfEvents: selectedEvents ? selectedEvents.length : 0,
    selectionMode:
      eventSelectionMode === 'selected-events'
        ? t('in-settings:tabs.specificEvents')
        : t('in-settings:tabs.eventTypes'),
    scopeType
  });

  return saveAlertingConfig(
    fromJS(
      createAlertingConfig(
        alertEntity ? alertEntity.get('id') : null,
        form.get('name').value,
        form.get('muteUntil').value,
        selectedAlertChannels,
        selectedEvents,
        query,
        selectedEventTypes,
        selectedApplicationAlertConfigs,
        form.get('customPayloadFields').toJS()
      )
    )
  );
}

function getEventSelectionMode(eventTypes, selectedApplicationAlertConfigs) {
  if (!eventTypes.isEmpty()) {
    return modeEventTypes;
  }
  if (!selectedApplicationAlertConfigs.isEmpty()) {
    return modeSelectedSmartAlerts;
  }
  return modeSelectedEvents;
}
