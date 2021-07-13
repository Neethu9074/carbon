/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import { Spacer } from '@instana/components';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import SelectedSmartAlertsList from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/SelectedSmartAlertsList';
import EventTypesSwitcher from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/EventTypesSwitcher';
import { limitForConnectedEvents } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import Events from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Events';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import { getEventSpecificationByIds } from 'in-api/eventSpecifications';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import { Row, Col } from 'in-components/layout/Grid/Grid';
import FormGroup from 'in-settings/components/FormGroup';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

import locals from './Step2.mless';

export const modeEventTypes = 'event-types';
export const modeSelectedEvents = 'selected-events';
export const modeSelectedSmartAlerts = 'selected-smart-alerts';

const eventSelectionModeOptions = [
  { value: modeEventTypes, label: t('in-settings:tabs.alertOnEventTypeS') },
  { value: modeSelectedEvents, label: t('in-settings:tabs.alertOnEventS') },
  ...(applicationSmartAlertsEnabled
    ? [{ value: modeSelectedSmartAlerts, label: t('in-settings:tabs.alertOnApSmartAlerts') }]
    : [])
];

export default function Step2({ form, setForm, onChange, onChangeEventSelectionMode }) {
  const eventSelectionMode = form.get('eventSelectionMode').value;
  const types = eventSelectionMode === modeEventTypes && form.get('eventTypes') ? form.get('eventTypes').value : null;

  return (
    <Fragment>
      <SectionHeading>{t('in-settings:tabs.2Events')}</SectionHeading>
      <DescriptionText>{t('in-settings:tabs.onlySendAlertsForEventTypesOrOnSelectedEvents')}</DescriptionText>
      <Row className={locals.eventSelection}>
        <Col lg={6}>
          {form.get('eventSelectionMode').map(field => (
            <FormGroup>
              <ComboBox
                name="alert-event-selection-mode"
                value={field.value}
                options={eventSelectionModeOptions}
                isClearable={false}
                onChange={e => {
                  const updatedForm = onChangeEventSelectionMode(form, e ? e.value : null);
                  if (updatedForm) {
                    setForm(updatedForm);
                  }
                }}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>
      </Row>
      {eventSelectionMode === modeEventTypes && types && (
        <EventTypeSelection form={form} types={types} onChange={onChange} />
      )}
      {eventSelectionMode === modeSelectedEvents && form.get('selectedEvents') && (
        <EventsSelection form={form} setForm={setForm} />
      )}
      {eventSelectionMode === modeSelectedSmartAlerts && <SmartAlertsSelection form={form} setForm={setForm} />}
    </Fragment>
  );
}

const getSelectedEventsForAlert = createMemoizedObservableForReferencedEntities(function(selectedEvents) {
  if (selectedEvents.length === 0) {
    return alwaysEmptyArray;
  }
  // null is treated as a pending result when converting the HTTP response into a result
  return getEventSpecificationByIds(selectedEvents).startWith(null);
});

function eventSelectionTableActions(form, setForm) {
  return {
    deselect: {
      deselect: deselectedEntity => {
        if (deselectedEntity) {
          form = form.updateIn(['selectedEvents'], field => {
            return field.setValue(field.value.filterNot(referencedId => referencedId === deselectedEntity.id));
          });
          setForm(form);
        }
      }
    }
  };
}

function submitEventSelection(form, setForm, selectedIds) {
  setForm(
    form.updateIn(['selectedEvents'], field => {
      return field.setValue(field.value.concat(fromJS(selectedIds)));
    })
  );
}

function EventTypeSelection({ form, onChange, types }) {
  return (
    <div className={locals.eventTypeSwitcher}>
      <EventTypesSwitcher form={form} onChange={onChange} types={types} formGroupStyles={locals.eventTypes} />
    </div>
  );
}

function EventsSelection({ form, setForm }) {
  const selectedEvents = form.get('selectedEvents')?.value.toJS() ?? [];

  return (
    <Fragment>
      <Events
        setTitle={false}
        loadEntities={() => getSelectedEventsForAlert(selectedEvents)}
        hasRowNavigation={false}
        noDataMessage={t('in-settings:tabs.noEventsSelected')}
        tableActions={eventSelectionTableActions(form, setForm)}
        pageSize={10}
        rightHeader={
          <SelectListDialogButton
            form={form}
            onSubmit={selectedIds => submitEventSelection(form, setForm, selectedIds)}
            title={t('in-settings:tabs.addEvents')}
            label={t('in-settings:tabs.addEvents')}
            listComponent={Events}
            hiddenIds={selectedEvents}
            limit={limitForConnectedEvents}
            createSubmitLabel={numberOfItems =>
              numberOfItems > 0
                ? t('in-settings:tabs.addNumberOfItemsEvent', { count: numberOfItems })
                : t('in-settings:tabs.addEvents')
            }
            requiresAtLeastOneMessage={t('in-settings:tabs.pleaseSelectAtLeastOneEvent')}
          />
        }
      />
      <TouchedMessages field={form.get('selectedEvents')} />
      <Spacer vertical="large" />
    </Fragment>
  );
}

function SmartAlertsSelection({ form, setForm }) {
  return (
    <>
      <SelectedSmartAlertsList form={form} setForm={setForm} />
      <TouchedMessages field={form.get('applicationAlertConfigIds')} />
      <Spacer vertical="large" />
    </>
  );
}
