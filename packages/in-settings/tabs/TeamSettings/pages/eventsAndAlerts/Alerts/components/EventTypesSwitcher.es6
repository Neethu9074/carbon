import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import FormGroup from 'in-settings/components/FormGroup';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import TouchedMessages from 'in-components/form/TouchedMessages';

const EventTypesSwitcher = ({ form, types, onChange, formGroupStyles }) => (
  <Fragment>
    <h3>Event Types</h3>
    <FormGroup noFlex className={formGroupStyles}>
      <EventType onChange={onChange} types={types} type="incident" label="Incidents" />
      <EventType onChange={onChange} types={types} type="critical" label="Critical Issues" />
      <EventType onChange={onChange} types={types} type="warning" label="Warning Issues" />
      <EventType onChange={onChange} types={types} type="change" label="Changes" />
      <EventType onChange={onChange} types={types} type="online" label="Online" />
      <EventType onChange={onChange} types={types} type="offline" label="Offline" />
    </FormGroup>
    <TouchedMessages field={form.get('eventTypes')} />
  </Fragment>
);

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

EventTypesSwitcher.propTypes = {
  form: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  types: PropTypes.object.isRequired,
  formGroupStyles: PropTypes.string
};

export default EventTypesSwitcher;
