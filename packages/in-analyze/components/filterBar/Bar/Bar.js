import React from 'react';

import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Bar.mless';

export default function Bar({ children, showClearFilters = true, onClearFilters }) {
  return (
    <div className={locals.bar}>
      <div className={locals.left}>
        <span className={locals.filter}>
          <SvgIcon className={locals.icon} type="lib_actions_filter" />
          Filters
        </span>
        <div>{children}</div>
      </div>

      {showClearFilters && (
        <Button icon="lib_openclose_cancel" kind="subtle" size="compact" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
