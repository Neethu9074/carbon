/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import { Button } from '@instana/components';

import locals from './DashboardHeaderButton.mless';

export default forwardRef(function DashboardHeaderButton(
  { darkTheme, className, kind, size = 'xl', ...buttonProps },
  ref
) {
  return (
    <div className={darkTheme ? locals.carbonDark : undefined}>
      <Button
        {...buttonProps}
        kind={kind ? kind : 'tertiary'}
        size={size}
        className={className}
        ref={ref}
        darkTheme={darkTheme}
      />
    </div>
  );
});
