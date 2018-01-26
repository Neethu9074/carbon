import React from 'react';

import locals from './SearchField.mless';

export default function SearchField({ query, onChange }) {
  return (
    <input
      className={locals.searchField}
      type="search"
      placeholder="Search…"
      value={query}
      onChange={e => {
        onChange(e.target.value);
      }}
    />
  );
}
