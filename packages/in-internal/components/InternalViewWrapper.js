import React from 'react';

import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import Sticky from 'in-components/Sticky';

import locals from './InternalViewWrapper.mless';

export default function InternalViewWrapper({ children }) {
  return (
    <Sticky header={<BreadcrumbHeader useFullAvailableWidth />}>
      <div className={locals.content}>{children}</div>
    </Sticky>
  );
}
