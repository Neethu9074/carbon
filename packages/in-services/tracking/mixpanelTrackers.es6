import { get } from 'lodash';

import { createDurationTracker, createTracker, init as initMixpanelCore } from 'in-services/tracking/mixpanel';
import { applicationDashboard, serviceDashboard, endpointDashboard } from 'in-applications/navigation/paths';
import { isTwoZeroBetaPhase, twoZeroModeEnabled } from 'in-services/featureFlags';
import getApplication from 'in-subscription/application/getApplication';
import { applicationId } from 'in-applications/navigation/matrix';
import { navigationParameters$ } from 'in-stores/navigation';
import { analyze } from 'in-analyze/navigation/paths';
import { urlQueryKeys } from 'in-stores/time/config';
import { just } from 'reactive-observables';

export const v2UsageDurationTracker = createDurationTracker('hybrid.v2');

export function init() {
  if (initMixpanelCore()) {
    initUsageDurationTrackers();
    initActivityHeartbeat();
  }
}

/**
 * Send an activity beacon once each hour. This is used by the portal to track which users have used Instana on which
 * day. Just tracking the sign in would not be good enough, since a user can use Instana up to 7 days without signing
 * in again.
 */
function initActivityHeartbeat() {
  const trackActivity = createTracker('user.isActive');
  trackActivity();
  setInterval(trackActivity, 60 * 60 * 1000);
}

function initUsageDurationTrackers() {
  trackV2UsageDuration();
  trackLiveModeUsageDuration();
  trackWindowSizeUsageDuration();
  trackApplicationUsageDuration();
  trackDashboardAndTabUsageDuration();
}

function trackV2UsageDuration() {
  if (!isTwoZeroBetaPhase) {
    return;
  }
  // will be stopped in VersionSwitcher immediately before page reload to switch v2 mode
  v2UsageDurationTracker.start();
}

function trackLiveModeUsageDuration() {
  if (!twoZeroModeEnabled) {
    // only track live mode in 2.0
    return;
  }
  let first = true;
  const liveModeUsageDurationTracker = createDurationTracker('time.liveMode');
  navigationParameters$
    .map(location => get(location, ['query', urlQueryKeys.autoRefresh], null))
    .map(autoRefresh => autoRefresh === 'true')
    .distinct()
    .subscribe(autoRefresh => {
      liveModeUsageDurationTracker.stop(
        first
          ? { liveModeNowEnabled: autoRefresh }
          : { liveModeWasEnabled: !autoRefresh, liveModeNowEnabled: autoRefresh }
      );
      first = false;
      liveModeUsageDurationTracker.start();
    });
}

function trackWindowSizeUsageDuration() {
  if (!twoZeroModeEnabled) {
    // only track window size in 2.0
    return;
  }
  let lastWindowSize = null;
  const windowSizeUsageDurationTracker = createDurationTracker('time.windowSize');
  navigationParameters$
    .map(location => get(location, ['query', urlQueryKeys.windowSize], null))
    .distinct()
    .subscribe(windowSize => {
      windowSizeUsageDurationTracker.stop(lastWindowSize ? { windowSize: lastWindowSize } : {});
      lastWindowSize = windowSize;
      windowSizeUsageDurationTracker.start();
    });
}

function trackApplicationUsageDuration() {
  if (!twoZeroModeEnabled) {
    return;
  }
  let currentApplicationContext = null;
  const applicationUsageDurationTracker = createDurationTracker('application.context');
  navigationParameters$
    .map(location => {
      const pathCanHaveApplicationContext =
        location.pathname &&
        (location.pathname.indexOf('/services') >= 0 ||
          location.pathname.indexOf('/application/') === 0 ||
          location.pathname.indexOf('/service/') === 0 ||
          location.pathname.indexOf('/endpoint/') === 0 ||
          location.pathname.indexOf('/analyze/') === 0);
      const appId =
        get(location, ['matrix', applicationDashboard, applicationId]) ||
        get(location, ['matrix', serviceDashboard, applicationId]) ||
        get(location, ['matrix', endpointDashboard, applicationId]) ||
        get(location, ['matrix', analyze, applicationId]) ||
        null;
      return { pathCanHaveApplicationContext, appId };
    })
    .distinct(
      (
        { pathCanHaveApplicationContext: pathCanHaveApplicationContext1, appId: appId1 },
        { pathCanHaveApplicationContext: pathCanHaveApplicationContext2, appId: appId2 }
      ) => pathCanHaveApplicationContext1 !== pathCanHaveApplicationContext2 || appId1 !== appId2
    )
    .flatMap(
      ({ pathCanHaveApplicationContext, appId }) =>
        appId
          ? getApplication({ id: appId }).filter(data => data.progress && !data.progress.loading)
          : just({ data: { label: pathCanHaveApplicationContext ? 'no application context' : 'not applicable' } })
    )
    .map(result => result.data.label)
    .subscribe(applicationLabel => {
      if (currentApplicationContext) {
        applicationUsageDurationTracker.stop({ application: currentApplicationContext });
      }
      currentApplicationContext = applicationLabel;
      applicationUsageDurationTracker.start();
    });
}

const dashboardNames = [applicationDashboard, serviceDashboard, endpointDashboard];

const tabNames = [
  '/summary',
  '/services',
  '/performance',
  '/messages',
  '/infrastructure',
  '/configuration',
  '/flowMap',
  '/endpoints'
];

function trackDashboardAndTabUsageDuration() {
  if (!twoZeroModeEnabled) {
    return;
  }
  let currentDashboard = null;
  let currentTab = null;
  const dashboardTabUsageDurationTracker = createDurationTracker('dashboard.tab');
  navigationParameters$
    .map(location => {
      const matrix = location.matrix;
      if (!matrix) {
        return null;
      }
      let dashboard = null;
      for (let i = 0; i < dashboardNames.length; i++) {
        if (matrix[dashboardNames[i]]) {
          dashboard = dashboardNames[i];
          break;
        }
      }
      let tab = null;
      for (let i = 0; i < tabNames.length; i++) {
        if (matrix[tabNames[i]]) {
          tab = tabNames[i];
          break;
        }
      }
      return { dashboard, tab };
    })
    .distinct()
    .subscribe(({ dashboard, tab }) => {
      if (currentDashboard && currentTab && (dashboard !== currentDashboard || tab !== currentTab)) {
        dashboardTabUsageDurationTracker.stop({ dashboard: currentDashboard, tab: currentTab });
      }
      currentDashboard = dashboard;
      currentTab = tab;
      if (currentDashboard && currentTab) {
        dashboardTabUsageDurationTracker.start();
      }
    });
}
