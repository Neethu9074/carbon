/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import MomentLocaleUtils from 'react-day-picker/moment';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { assign } from 'lodash';
import React from 'react';

import { themes } from '@instana/design-tokens';
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

import locals from './DateInput.mless';

const { isTab } = keyCodes;

type DateInputValue = string | Nullish;
type DateInputOnChange = (s: DateInputValue) => void;

export interface DateInputProps {
  value: DateInputValue;
  onChange: DateInputOnChange;
  iconType?: string;
  disabled?: boolean;
  /* if set, this reduces the width of the input field to only use a
   * small width, so that about 10 chars fit well into it.
   */
  fixedWidth?: boolean;
  hasError?: boolean;
}

export default function DateInput(props: DateInputProps) {
  const { value, onChange = identity, disabled, iconType, fixedWidth } = props;
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
  delete inputProps.fixedWidth;

  if (disabled) {
    return (
      <Input
        {...inputProps}
        type="text"
        value={value || ''}
        // explicitly setting onChange to undefined here to avoid typescript conflicts with the signature of onChange from DateInputProps
        onChange={undefined}
        className={fixedWidth ? locals.fixedWidth : undefined}
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
          fixedWidth={fixedWidth}
        />
      )}
    </Overlay>
  );
}

interface DatePickerInputProps {
  inputProps: DateInputProps;
  iconType?: DateInputProps['iconType'];
  onChange: DateInputOnChange;
  fixedWidth?: boolean;

  open: () => void;
  close: () => void;

  refSetter: OverlayContentProps['refSetter'];
}

function DatePickerInput({ open, onChange, refSetter, inputProps, close, iconType, fixedWidth }: DatePickerInputProps) {
  return (
    <Input
      className={fixedWidth ? locals.fixedWidth : undefined}
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

  const modifiersStyles = {
    selected: { backgroundColor: themes.default.ids.color.option.teal['500'] },
    current: { color: themes.default.ids.color.option.neutral['900'] }
  } as const;

  const modifiers = {
    selected: dateValid && !isBlank(value) ? parseDate(value!) : undefined,
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
