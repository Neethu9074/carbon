import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import {
  websitesPathFullyQualified,
  websiteMonitoringPath,
  websitePathFullyQualified,
  newWebsitePathFullyQualified
} from 'in-websites/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';

// all the lazy loaded views. Bundle name: websites
import WebsiteDashboard from 'promise-loader?global,websites!in-websites/WebsiteDashboard/WebsiteDashboard';
import NewWebsiteFlow from 'promise-loader?global,websites!in-websites/NewWebsiteFlow/NewWebsiteFlow';
import WebsitesList from 'promise-loader?global,websites!in-websites/WebsitesList/WebsitesList';

export default (
  <Fragment>
    <Route path={websitesPathFullyQualified} component={createAsyncViewComponent(WebsitesList)} />
    <Route path={websitePathFullyQualified} component={createAsyncViewComponent(WebsiteDashboard)} />
    <Route path={newWebsitePathFullyQualified} component={createAsyncViewComponent(NewWebsiteFlow)} />
    <RedirectWithHash from={websiteMonitoringPath} to={websitesPathFullyQualified} />
  </Fragment>
);
