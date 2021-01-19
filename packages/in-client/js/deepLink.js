/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Route } from 'react-router-dom';
import React from 'react';

import RedirectWithHash from 'in-components/RedirectWithHash';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { getLinkToSession } from 'in-mobile-apps/navigation/paths';
import { getLinkToPageLoad } from 'in-websites/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';

const path = '/dl';

export default <Route path={path} component={DeepLink} />;

function DeepLink({ location }) {
  const to$ =
    resolveApplicationsTraceIdDeepLink(location) ||
    resolveWebsitesPageLoadIdDeepLink(location) ||
    resolveMobileAppsSessionIdDeepLink(location);

  if (to$) {
    return <RedirectWithHash to$={to$} />;
  }

  return <RedirectWithHash to="/" />;
}

function resolveApplicationsTraceIdDeepLink(location) {
  const traceId = getMatrixParameter(location, path, 'applications.trace.id');
  if (traceId) {
    return getLinkToTraceDetail(traceId);
  }
}

function resolveWebsitesPageLoadIdDeepLink(location) {
  const pageLoadId = getMatrixParameter(location, path, 'websites.pageLoad.id');
  const beaconTimestamp = getMatrixParameter(location, path, 'websites.pageLoad.timestamp');
  if (pageLoadId && beaconTimestamp) {
    return getLinkToPageLoad({ pageLoadId, beaconTimestamp });
  }
}

function resolveMobileAppsSessionIdDeepLink(location) {
  const sessionId = getMatrixParameter(location, path, 'mobileApps.session.id');
  const beaconTimestamp = getMatrixParameter(location, path, 'mobileApps.session.timestamp');
  if (sessionId && beaconTimestamp) {
    return getLinkToSession({ sessionId, beaconTimestamp });
  }
}
