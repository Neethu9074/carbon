/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import SmartAlertsSelection from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/SmartAlertsSelection';
import EventTypesSwitcher from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/EventTypesSwitcher';
import EventsSelection from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Alerts/components/EventsSelection';
import SectionHeading from 'in-settings/components/SectionHeading';
import DescriptionText from 'in-components/form/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Col, Row } from 'in-components/layout/Grid/Grid';
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
  { value: modeSelectedSmartAlerts, label: t('in-settings:tabs.alertOnApSmartAlerts') }
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

function EventTypeSelection({ form, onChange, types }) {
  return (
    <div className={locals.eventTypeSwitcher}>
      <EventTypesSwitcher form={form} onChange={onChange} types={types} formGroupStyles={locals.eventTypes} />
    </div>
  );
}
