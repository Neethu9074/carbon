import { Switch, Route } from 'react-router-dom';
import React from 'react';

import ApplicationViewBreadcrumb from 'in-views/applicationView/breadcrumbs/ApplicationViewBreadcrumb';
import { getTabs } from 'in-views/applicationView/tabs/index';
import TabView from 'in-sdk/components/dashboard/TabView';

export default function ApplicationView(props) {
  const breadcrumbs = [<ApplicationViewBreadcrumb />];

  return (
    <Switch>
      <Route path="/*" render={() => <TabView tabs={getTabs()} props={{ ...props }} breadcrumbs={breadcrumbs} />} />
    </Switch>
  );
}
