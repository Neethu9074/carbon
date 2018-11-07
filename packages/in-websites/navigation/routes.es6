import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import {
  websitesPathFullyQualified,
  websiteMonitoringPath,
  websitePathFullyQualified
} from 'in-websites/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';

// all the lazy loaded views. Bundle name: websites
import WebsiteDashboard from 'promise-loader?global,websites!in-websites/WebsiteDashboard/WebsiteDashboard';
import WebsitesList from 'promise-loader?global,websites!in-websites/WebsitesList/WebsitesList';

export default (
  <Fragment>
    <Route path={websitesPathFullyQualified} component={createAsyncViewComponent(WebsitesList)} />
    <Route path={websitePathFullyQualified} component={createAsyncViewComponent(WebsiteDashboard)} />
    <RedirectWithHash from={websiteMonitoringPath} to={websitesPathFullyQualified} />
  </Fragment>
);
