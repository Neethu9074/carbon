import React from 'react';

import FilterPresets from 'in-components/SearchBar/components/FilterPresets';

import './SearchMenu.less';

const block = 'in-search-menu';

export default function SearchMenu() {
  return (
    <div className={block}>
      <FilterPresets />
    </div>
  );
}
