import { Route } from 'react-router-dom';
import React, { Fragment } from 'react';

import { websitesPathFullyQualified, websiteMonitoringPath } from 'in-websites/navigation/paths';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash';

// all the lazy loaded views. Bundle name: websites
import WebsitesList from 'promise-loader?global,websites!in-websites/WebsitesList/WebsitesList';

export default (
  <Fragment>
    <Route path={websitesPathFullyQualified} component={createAsyncViewComponent(WebsitesList)} />
    <RedirectWithHash from={websiteMonitoringPath} to={websitesPathFullyQualified} />
  </Fragment>
);
