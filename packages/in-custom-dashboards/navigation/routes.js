import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { customDashboardingPath } from 'in-custom-dashboards/navigation/paths';

// all the lazy loaded views. Bundle name: customDashboards
import CustomDashboardView from 'promise-loader?global,customDashboards!in-custom-dashboards/OverviewDemo';

export default (
  <Fragment>
    <Route path={customDashboardingPath} component={createAsyncViewComponent(CustomDashboardView)} />
  </Fragment>
);
