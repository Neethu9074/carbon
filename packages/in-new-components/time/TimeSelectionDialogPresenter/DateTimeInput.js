import React from 'react';

import formatInputTime from 'in-new-components/time/TimeSelectionDialogPresenter/timeInputFormatter';
import TouchedMessages from 'in-components/form/TouchedMessages';
import DateInput from 'in-components/form/DateInput';
import Input from 'in-components/form/Input';

import locals from './DateTimeInput.mless';

export default function DateTimeInput({ form, path, setValue }) {
  const dateField = form.get(path).get('date');
  const timeField = form.get(path).get('time');

  return (
    <div className={locals.wrapper}>
      <div className={locals.inputs}>
        <DateInput
          className={locals.field}
          id={`${path}-date`}
          value={dateField.value}
          onChange={v => setValue(form, [path, 'date'], v)}
          hasError={!dateField.valid && dateField.touched}
        />

        <Input
          className={locals.field}
          type="text"
          id={`${path}-time`}
          value={timeField.value}
          onChange={e => setValue(form, [path, 'time'], e.target.value)}
          onBlur={e => setValue(form, [path, 'time'], formatInputTime(e.target.value, 'HH:mm:ss'))}
          hasError={!timeField.valid && timeField.touched}
        />
      </div>
      <TouchedMessages field={dateField} />
      <TouchedMessages field={timeField} />
    </div>
  );
}
