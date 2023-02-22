/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef, useState } from 'react';
import classNames from 'classnames';

import { keyCodes, SvgIcon } from '@instana/components';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './SearchInput.mless';

const { isReturn, isArrowDown } = keyCodes;

export interface SearchInputProps {
  className?: string;
  inputClassName?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  query?: string;
  width?: string | number;
  maxWidth?: string | number;
  autoFocus?: boolean;
  placeholder?: string;
  hasError?: boolean;
  onReturn?: (e: React.KeyboardEvent) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  withoutIcon?: boolean;
  onArrowDown?: (e: React.KeyboardEvent) => void;
  id?: string;
  name?: string;
  inputRef?: React.MutableRefObject<HTMLInputElement>;
}

export default function SearchInput({
  className = '',
  inputClassName = '',
  onChange,
  disabled = false,
  query,
  width,
  maxWidth,
  autoFocus,
  placeholder,
  hasError,
  onReturn,
  onFocus,
  onBlur,
  withoutIcon = false,
  onArrowDown,
  id,
  name,
  inputRef
}: SearchInputProps) {
  const fallbackRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  inputRef = inputRef ?? fallbackRef;

  const [hasFocus, setHasFocus] = useState(false);
  const isDirty = query?.trim();

  return (
    <div
      className={classNames({
        [locals.wrapper]: true,
        [locals.hasFocus]: hasFocus,
        [className]: className,
        [locals.hasError]: hasError,
        [locals.wrapperDisabled]: disabled
      })}
      style={{ maxWidth, width }}
    >
      <Input
        id={id}
        name={name}
        refSetter={inputRef}
        className={classNames({
          [locals.searchInput]: true,
          [locals.useTransparency]: hasError,
          [className]: className,
          [inputClassName]: inputClassName
        })}
        disabled={disabled}
        placeholder={placeholder ?? t('in-components:searchInput.placeholderSearch')}
        value={query}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
        onKeyDown={e => {
          if (onReturn && isReturn(e)) {
            onReturn(e);
          }
          if (onArrowDown && isArrowDown(e)) {
            stopPropagationAndPreventDefault(e);
            onArrowDown(e);
          }
        }}
        onFocus={() => {
          setHasFocus(true);
          onFocus?.();
        }}
        onBlur={() => {
          setHasFocus(false);
          onBlur?.();
        }}
      />
      <SvgIcon
        className={classNames({
          [locals.icon]: true,
          [locals.iconDisabled]: disabled,
          [locals.iconHidden]: withoutIcon || isDirty
        })}
        type="lib_actions_search"
        onClick={disabled ? undefined : () => inputRef?.current?.focus()}
        area-hidden="true"
      />
    </div>
  );
}
