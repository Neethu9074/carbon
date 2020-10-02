import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { assign } from 'lodash';
import theme from 'in-themes';
import React from 'react';

import { formatDate, parseDate } from 'in-services/formatters/date';
import { dateValidator } from 'in-services/validators/date';
import Overlay from 'in-new-components/overlays/Overlay';
import { identity } from 'in-services/util/function';
import keyCodes from 'in-components/keyCodes';
import Input from 'in-components/form/Input';

import locals from './DateInput.mless';

export default function DatePicker(props) {
  const { value, onChange = identity, disabled, iconType } = props;
  const inputProps = assign({}, props);
  delete inputProps.onChange;
  delete inputProps.type;
  delete inputProps.onClick;
  delete inputProps.overlayPosition;

  if (disabled) {
    return <Input type="text" {...inputProps} />;
  }
  return (
    <Overlay content={DatePickerOverlay} props={{ value, onChange, inputProps, iconType }} withoutWrapper>
      {DatePickerInput}
    </Overlay>
  );
}

function DatePickerInput({ open, onChange, refSetter, inputProps, close, iconType }) {
  return (
    <Input
      type="text"
      autoComplete="off"
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => {
        // keyCode is deprecated and code is not yet supported everywhere
        const code = e.code != null ? e.code : e.keyCode;
        if (code === keyCodes.tab) {
          close();
        }
      }}
      onClick={open}
      refSetter={refSetter}
      onIconClick={iconType ? open : undefined}
      {...inputProps}
    />
  );
}

function DatePickerOverlay({ onChange, close, value }) {
  const dateValid = dateValidator(value) == null;
  const modifiers = {
    selected: new Date(value),
    current: new Date()
  };
  const modifiersStyles = {
    selected: { backgroundColor: dateValid ? theme.lib.colors.teal800 : 'transparent' },
    current: { color: theme.lib.colors.N900Primary }
  };
  return (
    <div className={locals.overlay}>
      <DayPicker
        month={dateValid ? modifiers.selected : modifiers.current}
        modifiersStyles={modifiersStyles}
        modifiers={modifiers}
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
