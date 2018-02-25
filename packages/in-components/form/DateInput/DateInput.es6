import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { assign } from 'lodash';
import React from 'react';

import { formatDate, parseDate } from 'in-services/formatters/date';
import { dateValidator } from 'in-services/validators/date';
import Overlay from 'in-new-components/overlays/Overlay';
import { identity } from 'in-services/util/function';
import Input from 'in-components/form/Input';

import locals from './DateInput.mless';

export default function DatePicker(props) {
  const { value, onChange = identity, disabled } = props;
  const inputProps = assign({}, props);
  delete inputProps.onChange;
  delete inputProps.type;
  delete inputProps.onClick;

  if (disabled) {
    return <Input type="text" {...inputProps} />;
  }
  return (
    <Overlay content={DatePickerOverlay} props={{ value, onChange, inputProps }} withoutWrapper>
      {DatePickerInput}
    </Overlay>
  );
}

function DatePickerInput({ open, onChange, refSetter, inputProps }) {
  return (
    <Input type="text" onChange={e => onChange(e.target.value)} onClick={open} refSetter={refSetter} {...inputProps} />
  );
}

function DatePickerOverlay({ onChange, close, value }) {
  const dateValid = dateValidator(value) == null;
  return (
    <div className={locals.overlay}>
      <DayPicker
        selectedDays={dateValid ? parseDate(value) : undefined}
        onDayClick={d => {
          onChange(formatDate(d));
          close();
        }}
      />

      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          close();
        }}
        className={locals.close}
      >
        Close
      </a>
    </div>
  );
}
