import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import classNames from 'classnames';
import keyCodes from 'in-components/keyCodes';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SearchInput.mless';

export default function SearchInput({
  className,
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
          [className]: className
        })}
        disabled={disabled}
        type="search"
        placeholder={placeholder ?? 'Search…'}
        value={query}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
        onKeyDown={e => {
          if (onReturn && e.keyCode === keyCodes.enter) {
            onReturn(e);
          }
          if (onArrowDown && e.keyCode === keyCodes.arrows.down) {
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
      {!withoutIcon && (
        <SvgIcon
          className={classNames({
            [locals.icon]: true,
            [locals.withoutIcon]: disabled
          })}
          type="lib_actions_search"
          onClick={disabled ? undefined : () => inputRef?.current?.focus()}
        />
      )}
    </div>
  );
}

SearchInput.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
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
