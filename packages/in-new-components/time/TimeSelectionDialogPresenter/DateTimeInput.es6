import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import DateInput from 'in-components/form/DateInput';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import moment from 'moment';

import locals from './DateTimeInput.mless';

export default function DateTimeInput({ title, form, path, setValue, className }) {
  const dateField = form.get(path).get('date');
  const timeField = form.get(path).get('time');

  return (
    <div className={className}>
      <h2 className={locals.title}>{title}</h2>

      <div className={locals.inputs}>
        <FormGroup>
          <Label htmlFor={`${path}-date`} hasError={!dateField.valid && dateField.touched} className={locals.label}>
            Date
          </Label>
          <DateInput
            id={`${path}-date`}
            value={dateField.value}
            onChange={v => setValue(form, [path, 'date'], v)}
            hasError={!dateField.valid && dateField.touched}
            className={locals.field}
            overlayPosition="fixed"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor={`${path}-time`} hasError={!timeField.valid && timeField.touched} className={locals.label}>
            Time
          </Label>
          <Input
            type="text"
            id={`${path}-time`}
            value={timeField.value}
            onChange={e => setValue(form, [path, 'time'], e.target.value)}
            onBlur={e => setValue(form, [path, 'time'], formatTime(e.target.value))}
            hasError={!timeField.valid && timeField.touched}
            className={locals.field}
          />
        </FormGroup>
      </div>

      <TouchedMessages field={dateField} />
      <TouchedMessages field={timeField} />
    </div>
  );
}

/**
 * makes setting a time for the user a little bit easier by setting the right format
 * @param input
 * @returns {*}
 */
function formatTime(input) {
  const date = moment(input, 'HH:mm:ss');
  if (date.isValid()) {
    return date.format('HH:mm:ss');
  } else {
    return input;
  }
}
