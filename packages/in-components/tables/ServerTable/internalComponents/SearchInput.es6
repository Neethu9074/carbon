import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './SearchInput.mless';

export default function SearchInput({ onChange }) {
  return (
    <div className={locals.wrapper}>
      <SvgIcon className={locals.icon} type="search" width={14} height={14} color="#698189" />
      <input
        className={locals.searchInput}
        type="search"
        placeholder="Search…"
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
