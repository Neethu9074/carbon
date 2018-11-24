import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import Button from 'in-new-components/Button';

import locals from './Bar.mless';

export default function Bar({ children, showClearFilters = true, onClearFilters }) {
  return (
    <div className={locals.wrapper}>
      <MaxWidthFullscreenContainer className={locals.bar}>
        <div>{children}</div>

        {showClearFilters && (
          <Button icon="lib_actions_cached" kind="subtle" size="compact" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </MaxWidthFullscreenContainer>
    </div>
  );
}
