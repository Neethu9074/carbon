/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import TouchedMessages from 'in-components/form/TouchedMessages';
import TimeInput from 'in-components/TimeInput/TimeInput';
import DateInput from 'in-components/form/DateInput';

import locals from './DateTimeInput.mless';

export default function DateTimeInput({ form, path, setValue }) {
  const dateField = form.get(path).get('date');
  const timeField = form.get(path).get('time');

  return (
    <div className={locals.wrapper} onKeyDown={onKeyDown}>
      <div className={locals.inputs}>
        <DateInput
          className={locals.field}
          id={`${path}-date`}
          value={dateField.value}
          onChange={v => setValue(form, [path, 'date'], v)}
          hasError={!dateField.valid && dateField.touched}
        />

        <TimeInput
          id={`${path}-time`}
          value={timeField.value}
          onChange={timeString => setValue(form, [path, 'time'], timeString)}
          hasError={!timeField.valid && timeField.touched}
          direction="top"
        />
      </div>
      <TouchedMessages field={dateField} />
      <TouchedMessages field={timeField} />
    </div>
  );
}

function onKeyDown(e) {
  if (e.defaultPrevented) return;
  // Intercept Enter and Escape to prevent accidental closing of a dialog when used inside a dialog
  if ((e.key === 'Enter', e.key === 'Escape')) return stopPropagationAndPreventDefault(e);
}
