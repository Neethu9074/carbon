/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import MomentLocaleUtils from 'react-day-picker/moment';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { assign } from 'lodash';
import React from 'react';

import { keyCodes } from '@instana/components';

import { OverlayContentProps } from 'in-components/overlays/Overlay/types';
import { formatDate, parseDate } from 'in-services/formatters/date';
import { dateValidator } from 'in-services/validators/date';
import Overlay from 'in-components/overlays/Overlay';
import { identity } from 'in-services/util/function';
import { isBlank } from 'in-services/util/string';
import Input from 'in-components/form/Input';
import { t, activeLanguage } from 'in-i18n';
import { Nullish } from 'in-types';
import theme from 'in-themes';

import locals from './DateInput.mless';

const { isTab } = keyCodes;
const modifiersStyles = {
  selected: { backgroundColor: theme.lib.colors.teal800 },
  current: { color: theme.lib.colors.N900Primary }
} as const;

type DateInputValue = string | Nullish;
type DateInputOnChange = (s: DateInputValue) => void;

interface DateInputProps {
  value: DateInputValue;
  onChange: DateInputOnChange;
  iconType?: string;
  disabled?: boolean;
  staticSize?: boolean;
}

export default function DateInput(props: DateInputProps) {
  const { value, onChange = identity, disabled, iconType, staticSize } = props;
  const inputProps = assign({}, props);

  // @ts-expect-error ignoring the from a type perspective superfluous deletes here,
  // because some older code might rely on them and there is no downside to having them
  delete inputProps.type;
  // @ts-expect-error
  delete inputProps.onClick;
  // @ts-expect-error
  delete inputProps.overlayPosition;
  // @ts-expect-error
  delete inputProps.onChange;

  if (disabled) {
    return (
      <Input
        {...inputProps}
        type="text"
        value={value || ''}
        // explicitly setting onChange to undefined here to avoid typescript conflicts with the signature of onChange from DateInputProps
        onChange={undefined}
        className={staticSize ? locals.dateInputSection : undefined}
      />
    );
  }
  return (
    <Overlay content={DatePickerOverlay} props={{ value, onChange, inputProps, iconType }} withoutWrapper>
      {({ refSetter, open, close }) => (
        <DatePickerInput
          open={open}
          onChange={onChange}
          refSetter={refSetter}
          inputProps={inputProps}
          close={close}
          iconType={iconType}
          staticSize={staticSize}
        />
      )}
    </Overlay>
  );
}

interface DatePickerInputProps {
  inputProps: DateInputProps;
  iconType?: DateInputProps['iconType'];
  onChange: DateInputOnChange;
  staticSize?: boolean;

  open: () => void;
  close: () => void;

  refSetter: OverlayContentProps['refSetter'];
}

function DatePickerInput({ open, onChange, refSetter, inputProps, close, iconType, staticSize }: DatePickerInputProps) {
  return (
    <Input
      className={staticSize ? locals.dateInputSection : undefined}
      type="text"
      autoComplete="off"
      onKeyDown={e => {
        if (isTab(e)) {
          close();
        }
      }}
      onClick={open}
      onIconClick={iconType ? open : undefined}
      {...inputProps}
      onChange={e => onChange(e.target.value)}
      // @ts-expect-error ignoring ts error on ref type narrowing issues
      refSetter={refSetter}
    />
  );
}

interface DatePickerOverlayProps {
  onChange: DateInputOnChange;
  value: DateInputValue;
  close: () => void;
}

function DatePickerOverlay({ onChange, close, value }: DatePickerOverlayProps) {
  const dateValid = dateValidator(value) == null;

  const modifiers = {
    selected: dateValid && !isBlank(value) ? new Date(value!) : undefined,
    current: new Date()
  };

  return (
    <div className={locals.overlay}>
      <DayPicker
        month={modifiers.selected ?? modifiers.current}
        modifiersStyles={modifiersStyles}
        modifiers={modifiers}
        selectedDays={dateValid ? parseDate(value!) : undefined}
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
