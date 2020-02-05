import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import {
  listPathFullyQualified,
  viewPathFullyQualified,
  newPathFullyQualified,
  customDashboardsPath
} from 'in-custom-dashboards/navigation/url';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';

// all the lazy loaded views. Bundle name: customDashboarding
import CustomDashboardList from 'promise-loader?global,customDashboarding!in-custom-dashboards/CustomDashboardList/CustomDashboardList';
import NewCustomDashboard from 'promise-loader?global,customDashboarding!in-custom-dashboards/CustomDashboard/NewCustomDashboard';
import CustomDashboard from 'promise-loader?global,customDashboarding!in-custom-dashboards/CustomDashboard/CustomDashboard';

export default (
  <Fragment>
    <Route path={listPathFullyQualified} component={createAsyncViewComponent(CustomDashboardList)} />
    <Route path={newPathFullyQualified} component={createAsyncViewComponent(NewCustomDashboard)} />
    <Route path={viewPathFullyQualified} component={createAsyncViewComponent(CustomDashboard)} />
    <RedirectWithHash from={customDashboardsPath} to={listPathFullyQualified} />
  </Fragment>
);
