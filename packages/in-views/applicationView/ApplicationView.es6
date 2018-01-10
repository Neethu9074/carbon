import { Switch, Route } from 'react-router-dom';
import React from 'react';

import ApplicationViewBreadcrumb from 'in-views/applicationView/breadcrumbs/ApplicationViewBreadcrumb';
import BreadcrumbHeader from 'in-sdk/components/dashboard/TabView/components/BreadcrumbHeader';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import ViewSwitcher from 'in-views/applicationView/components/ViewSwitcher';
import Applications from 'in-views/applicationView/tabs/Applications';
import Services from 'in-views/applicationView/tabs/Services';
import Sticky from 'in-components/Sticky';

export default function ApplicationView() {
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
        <Switch>
          <Route path="*/services" render={() => <Services />} />
          <Route path="/" render={() => <Applications />} />
        </Switch>
      </MaxWidthFullscreenContainer>
    </Sticky>
  );
}
