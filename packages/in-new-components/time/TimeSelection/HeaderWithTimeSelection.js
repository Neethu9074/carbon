/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import TimeSelection from 'in-new-components/time/TimeSelection/TimeSelection';

import locals from './HeaderWithTimeSelection.mless';

export default function HeaderWithTimeSelection({ darkTheme, children }) {
  return <MaxViewRestrictedHeader darkTheme={darkTheme}>{children}</MaxViewRestrictedHeader>;
}

function MaxViewRestrictedHeader({ darkTheme, children }) {
  return (
    <div className={locals.restrictredBreadcrumbHeader}>
      <div className={locals.maxWidthWrapper}>
        <div className={locals.right}>
          <TimeSelection darkTheme={darkTheme} />
        </div>
        <div className={locals.left}>{children || <div />}</div>
      </div>
    </div>
  );
}
