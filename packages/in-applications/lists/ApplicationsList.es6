import React from 'react';

import BreadcrumbHeader from 'in-sdk/components/dashboard/TabView/components/BreadcrumbHeader';
import ApplicationViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationViewBreadcrumb';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import Sticky from 'in-components/Sticky';

export default function ApplicationsList() {
  const breadcrumbs = [<ApplicationViewBreadcrumb />];

  return (
    <Sticky
      header={
        <div>
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          <BreadcrumbHeader />
        </div>
      }
    >
      <MaxWidthFullscreenContainer>
        <ViewSwitcher />
        Hello from applications list
      </MaxWidthFullscreenContainer>
    </Sticky>
  );
}
