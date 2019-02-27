import React from 'react';

import evaluateClassNames from 'in-services/util/classnames';
import { isNotBlank } from 'in-services/util/string';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SearchInput.mless';

export default function SearchInput({ onChange, query, maxWidth, autoFocus }) {
  return (
    <div className={locals.wrapper} style={{ maxWidth }}>
      <Input
        className={evaluateClassNames({
          [locals.searchInput]: true,
          [locals.searchInputHasText]: isNotBlank(query)
        })}
        type="search"
        placeholder=""
        value={query}
        onChange={e => onChange(e.target.value)}
        autoFocus={autoFocus}
      />
      <SvgIcon className={locals.icon} type="lib_actions_search" width={24} height={24} />
    </div>
  );
}
