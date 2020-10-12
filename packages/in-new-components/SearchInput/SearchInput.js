import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import evaluateClassNames from 'in-services/util/classnames';
import { isNotBlank } from 'in-services/util/string';
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
  onBlur
}) {
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef();

  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.hasFocus]: hasFocus,
        [className]: className,
        [locals.hasError]: hasError,
        [locals.wrapperDisabled]: disabled
      })}
    >
      <Input
        refSetter={inputRef}
        style={{ maxWidth, width }}
        className={evaluateClassNames({
          [locals.searchInput]: true,
          [locals.searchInputHasText]: isNotBlank(query),
          [locals.useTransparency]: hasError
        })}
        disabled={disabled}
        type="search"
        placeholder={placeholder ?? 'Search…'}
        value={query}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
        onKeyDown={
          onReturn
            ? e => {
                if (e.keyCode === keyCodes.enter) {
                  onReturn(e);
                }
              }
            : undefined
        }
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
        className={evaluateClassNames({
          [locals.icon]: true,
          [locals.iconDisabled]: disabled
        })}
        type="lib_actions_search"
        onClick={disabled ? undefined : () => inputRef?.current?.focus()}
      />
    </div>
  );
}

SearchInput.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onReturn: PropTypes.func,
  placeholder: PropTypes.string,
  query: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
