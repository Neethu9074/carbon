import React from 'react';

import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Bar.mless';

export default function Bar({ children, showClearFilters = true, onClearFilters }) {
  return (
    <LeftRightPadding className={locals.bar}>
      <span className={locals.filter}>
        <SvgIcon className={locals.icon} type="lib_actions_filter" />
        Filters
      </span>
      <div>{children}</div>

      {showClearFilters && (
        <Button icon="lib_actions_cached" kind="subtle" size="compact" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </LeftRightPadding>
  );
}
