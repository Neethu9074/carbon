import React from 'react';

import TimeSelection from 'in-new-components/time/TimeSelection/TimeSelection';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import Sticky from 'in-components/Sticky';

import locals from './InternalViewWrapper.mless';

export default function InternalViewWrapper({ children }) {
  return (
    <Sticky
      header={
        <div className={locals.header}>
          <BreadcrumbHeader useFullAvailableWidth />
          <TimeSelection />
        </div>
      }
    >
      <div className={locals.content}>{children}</div>
    </Sticky>
  );
}
