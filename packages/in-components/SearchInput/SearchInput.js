/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { SvgIcon } from '@instana/components';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { isReturn, isArrowDown } from 'in-components/keyCodes';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from './SearchInput.mless';

export default function SearchInput({
  className,
  inputClassName,
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
  inputRef
}) {
  const fallbackRef = useRef();
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
        refSetter={inputRef}
        className={classNames({
          [locals.searchInput]: true,
          [locals.useTransparency]: hasError,
          [className]: className,
          [inputClassName]: inputClassName
        })}
        disabled={disabled}
        type="search"
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

SearchInput.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  disabled: PropTypes.bool,
  withoutIcon: PropTypes.bool,
  hasError: PropTypes.bool,
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onReturn: PropTypes.func,
  onArrowDown: PropTypes.func,
  placeholder: PropTypes.string,
  query: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputRef: PropTypes.shape()
};
