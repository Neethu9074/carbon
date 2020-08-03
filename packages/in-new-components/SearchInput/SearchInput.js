import React from 'react';

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
  return (
    <div className={locals.wrapper} style={{ maxWidth, width }}>
      <Input
        className={evaluateClassNames({
          [locals.searchInput]: true,
          [locals.searchInputHasText]: isNotBlank(query),
          [locals.hasError]: hasError,
          [className]: className
        })}
        disabled={disabled}
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
        onKeyDown={onReturn ? e => {
          if (e.keyCode === keyCodes.enter) {
            onReturn(e);
          }
        } : undefined}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <SvgIcon className={locals.icon} type="lib_actions_search" />
    </div>
  );
}
