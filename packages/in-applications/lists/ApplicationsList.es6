import React from 'react';

import ApplicationViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationViewBreadcrumb';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import BreadcrumbHeader from 'in-applications/TabView/components/BreadcrumbHeader';
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
