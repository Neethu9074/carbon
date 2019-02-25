import React, { Fragment } from 'react';

import SelectEventsButton from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/EventFilters/components/SelectEventsButton';
import Events from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Events';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import { getEventSpecificationByIds } from 'in-api/eventSpecifications';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/Grid/Grid';
import Toggle from 'in-components/form/Toggle';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';

import locals from './Step2.mless';

export const modeEventTypes = 'event-types';
export const modeSelectedEvents = 'selected-events';

const eventSelectionModeOptions = [
  { value: modeEventTypes, label: 'Alert on Event Type(s)' },
  { value: modeSelectedEvents, label: 'Alert on Event(s)' }
];

export default function Step2({ form, setForm, onChange, onChangeEventSelectionMode }) {
  const eventSelectionMode = form.get('eventSelectionMode').value;
  const types = eventSelectionMode === modeEventTypes && form.get('eventTypes') ? form.get('eventTypes').value : null;
  const selectedEvents =
    eventSelectionMode === modeSelectedEvents && form.get('selectedEvents') ? form.get('selectedEvents').value : null;

  return (
    <Fragment>
      <SectionHeading>2. Events</SectionHeading>
      <DescriptionText>
        Only send alerts for a particular event, built-in event groups or a selection of event types.
      </DescriptionText>
      <Row className={locals.eventSelection}>
        <Col cols={6}>
          {form.get('eventSelectionMode').map(field => (
            <FormGroup>
              <ComboBox
                name="alert-event-selection-mode"
                value={field.value}
                options={eventSelectionModeOptions}
                clearable={false}
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
        {eventSelectionMode === modeEventTypes &&
          types && (
            <Col cols={6}>
              <h3>Event Types</h3>
              <FormGroup noFlex className={locals.eventTypes}>
                <EventType form={form} onChange={onChange} types={types} type="incident" label="Incidents" />
                <EventType form={form} onChange={onChange} types={types} type="critical" label="Critical Issues" />
                <EventType form={form} onChange={onChange} types={types} type="warning" label="Warning Issues" />
                <EventType form={form} onChange={onChange} types={types} type="change" label="Changes" />
                <EventType form={form} onChange={onChange} types={types} type="online" label="Online" />
                <EventType form={form} onChange={onChange} types={types} type="offline" label="Offline" />
              </FormGroup>
              <TouchedMessages field={form.get('eventTypes')} />
            </Col>
          )}
      </Row>
      {eventSelectionMode === modeSelectedEvents &&
        form.get('selectedEvents') && (
          <Fragment>
            <Events
              setTitle={false}
              loadEntities={() => getSelectedEventsForAlert(selectedEvents)}
              hasRowNavigation={false}
              noDataMessage="No Events Selected"
              tableActions={eventSelectionTableActions(form, setForm)}
              rightHeader={<SelectEventsButton />}
            />
            <TouchedMessages field={form.get('selectedEvents')} />
            <div style={{ marginBottom: '2rem' }} />
          </Fragment>
        )}
    </Fragment>
  );
}

function EventType({ onChange, types, type, label }) {
  return (
    <HorizontalFormGroup noHelpTextSpacer>
      <Label htmlFor={`event-type-${type}`}>{label}</Label>
      <Toggle
        id={`event-type-${type}`}
        checked={types.includes(type)}
        onChange={() => onSelectChanged(types, onChange, type)}
      />
    </HorizontalFormGroup>
  );
}

function onSelectChanged(types, onChange, type) {
  if (types.includes(type)) {
    types = types.delete(types.indexOf(type));
  } else {
    types = types.push(type);
  }
  onChange('eventTypes', types);
}

function getSelectedEventsForAlert(selectedEvents) {
  if (selectedEvents.isEmpty()) {
    return alwaysEmptyArray;
  }
  return getEventSpecificationByIds(selectedEvents);
}

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
