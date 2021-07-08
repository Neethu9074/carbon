/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import MomentLocaleUtils from 'react-day-picker/moment';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { assign } from 'lodash';
import React from 'react';

import { formatDate, parseDate } from 'in-services/formatters/date';
import { dateValidator } from 'in-services/validators/date';
import Overlay from 'in-components/overlays/Overlay';
import { identity } from 'in-services/util/function';
import { isBlank } from 'in-services/util/string';
import { isTab } from 'in-components/keyCodes';
import Input from 'in-components/form/Input';
import { t, activeLanguage } from 'in-i18n';
import theme from 'in-themes';

import locals from './DateInput.mless';

const modifiersStyles = {
  selected: { backgroundColor: theme.lib.colors.teal800 },
  current: { color: theme.lib.colors.N900Primary }
};

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
        if (isTab(e)) {
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
    selected: dateValid && !isBlank(value) ? new Date(value) : null,
    current: new Date()
  };

  return (
    <div className={locals.overlay}>
      <DayPicker
        month={modifiers.selected ?? modifiers.current}
        modifiersStyles={modifiersStyles}
        modifiers={modifiers}
        selectedDays={dateValid ? parseDate(value) : undefined}
        onDayClick={d => {
          onChange(formatDate(d));
          close();
        }}
        localeUtils={MomentLocaleUtils}
        locale={activeLanguage}
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
        {t('forms.actions.close')}
      </a>
    </div>
  );
}
