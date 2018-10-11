import React from 'react';

import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SearchInput.mless';

export default function SearchInput({ onChange, query, maxWidth }) {
  return (
    <div className={locals.wrapper} style={{ maxWidth }}>
      <Input
        className={locals.searchInput}
        type="search"
        placeholder=""
        value={query}
        onChange={e => onChange(e.target.value)}
      />
      <SvgIcon className={locals.icon} type="lib_actions_search" width={24} height={24} />
    </div>
  );
}
