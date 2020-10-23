import React, { Fragment } from 'react';
import { fromJS } from 'immutable';

import createMemoizedObservableForReferencedEntities from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/memoizeReferencedEntitiesObservable';
import EventTypesSwitcher from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/components/EventTypesSwitcher';
import { limitForConnectedEvents } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Alerts/Alert';
import SelectListDialogButton from 'in-settings/tabs/TeamSettings/components/SelectListDialogButton';
import Events from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Events';
import { getEventSpecificationByIds } from 'in-api/eventSpecifications';
import SectionHeading from 'in-settings/components/SectionHeading';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DescriptionText from 'in-components/form/DescriptionText';
import { Row, Col } from 'in-new-components/layout/Grid/Grid';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import FormGroup from 'in-settings/components/FormGroup';
import ComboBox from 'in-components/ComboBox';

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
    eventSelectionMode === modeSelectedEvents && form.get('selectedEvents')
      ? form.get('selectedEvents').value.toJS()
      : [];

  return (
    <Fragment>
      <SectionHeading>2. Events</SectionHeading>
      <DescriptionText>Only send alerts for event types or on selected events.</DescriptionText>
      <Row className={locals.eventSelection}>
        <Col lg={6}>
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
      </Row>
      {eventSelectionMode === modeEventTypes &&
        types && (
          <div className={locals.eventTypeSwitcher}>
            <EventTypesSwitcher form={form} onChange={onChange} types={types} formGroupStyles={locals.eventTypes} />
          </div>
        )}
      {eventSelectionMode === modeSelectedEvents &&
        form.get('selectedEvents') && (
          <Fragment>
            <Events
              setTitle={false}
              loadEntities={() => getSelectedEventsForAlert(selectedEvents)}
              hasRowNavigation={false}
              noDataMessage="No Events Selected"
              tableActions={eventSelectionTableActions(form, setForm)}
              pageSize={10}
              rightHeader={
                <SelectListDialogButton
                  form={form}
                  onSubmit={selectedIds => submitEventSelection(form, setForm, selectedIds)}
                  title="Add Events"
                  label={'Add Events'}
                  listComponent={Events}
                  hiddenIds={selectedEvents}
                  limit={limitForConnectedEvents}
                  createSubmitLabel={numberOfItems =>
                    numberOfItems > 0 ? `Add ${numberOfItems} Event${numberOfItems > 1 ? 's' : ''}` : 'Add Events'
                  }
                  requiresAtLeastOneMessage="Please select at least one event."
                />
              }
            />
            <TouchedMessages field={form.get('selectedEvents')} />
            <div style={{ marginBottom: '2rem' }} />
          </Fragment>
        )}
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
