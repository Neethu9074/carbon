/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route } from 'react-router-dom';
import React from 'react';

import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { useGenerateLinkToPageLoad } from 'in-websites/navigation/paths';
import { useLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { useLinkToSession } from 'in-mobile-apps/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import RedirectWithHash from 'in-components/RedirectWithHash';

const path = '/dl';

export default (
  <Route key="deepLink" path={path}>
    <DeepLink />
  </Route>
);

function DeepLink() {
  const location = useLocation();
  const getLinkToTraceDetail = useLinkToTraceDetail();
  const getLinkToMobileAppSession = useLinkToSession();
  const getLinkToWebsitePageLoad = useGenerateLinkToPageLoad();

  const to =
    resolveApplicationsTraceIdDeepLink(location, getLinkToTraceDetail) ||
    resolveWebsitesPageLoadIdDeepLink(location, getLinkToWebsitePageLoad) ||
    resolveMobileAppsSessionIdDeepLink(location, getLinkToMobileAppSession());

  if (to) {
    return <RedirectWithHash to={to} />;
  }

  return <RedirectWithHash to="/" />;
}

function resolveApplicationsTraceIdDeepLink(location, getLinkToTraceDetail) {
  const traceId = getMatrixParameter(location, path, 'applications.trace.id');
  if (traceId) {
    return getLinkToTraceDetail(traceId);
  }
}

function resolveWebsitesPageLoadIdDeepLink(location, getLinkToPageLoad) {
  const pageLoadId = getMatrixParameter(location, path, 'websites.pageLoad.id');
  const beaconTimestamp = getMatrixParameter(location, path, 'websites.pageLoad.timestamp');
  if (pageLoadId && beaconTimestamp) {
    return getLinkToPageLoad({ pageLoadId, beaconTimestamp });
  }
}

function resolveMobileAppsSessionIdDeepLink(location, getLinkToMobileAppSession) {
  const sessionId = getMatrixParameter(location, path, 'mobileApps.session.id');
  const beaconTimestamp = getMatrixParameter(location, path, 'mobileApps.session.timestamp');
  if (sessionId && beaconTimestamp) {
    return getLinkToMobileAppSession({ sessionId, beaconTimestamp });
  }
}
