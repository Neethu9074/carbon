import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import React from 'react';

import { formatDate } from 'in-services/formatters/date';
import Overlay from 'in-new-components/overlays/Overlay';
import Input from 'in-components/form/Input';

// import locals from './DateInput.mless';

export default function DatePicker({ value, onChange, disabled }) {
  if (disabled) {
    return <Input type="text" value={value} disabled />;
  }
  return (
    <Overlay content={DatePickerOverlay} props={{ value, onChange }} withoutWrapper>
      {({ open, refSetter }) => (
        <Input type="text" value={value} onChange={onChange} onClick={open} refSetter={refSetter} />
      )}
    </Overlay>
  );
}

function DatePickerOverlay({ onChange, close }) {
  return (
    <DayPicker
      onDayClick={d => {
        if (onChange) {
          onChange(formatDate(d));
        }
        close();
      }}
    />
  );
}
