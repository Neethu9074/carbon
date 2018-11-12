import { get } from 'lodash';

import { createDurationTracker, createTracker, init as initMixpanelCore } from 'in-services/tracking/mixpanel';
import { applicationDashboard, endpointDashboard, serviceDashboard } from 'in-applications/navigation/paths';
import { isTwoZeroBetaPhase, twoZeroModeEnabled } from 'in-services/featureFlags';
import { classicDashboard } from 'in-stores/navigation/paths/dashboardPaths';
import getApplication from 'in-subscription/application/getApplication';
import { applicationId } from 'in-applications/navigation/matrix';
import { navigationParameters$ } from 'in-stores/navigation';
import { combineLatest, just } from 'reactive-observables';
import { analyze } from 'in-analyze/navigation/paths';
import { urlQueryKeys } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';

const dashboardNames = [applicationDashboard, serviceDashboard, endpointDashboard];

const tabNames = [
  '/summary',
  '/services',
  '/performance',
  '/map',
  '/errorMessages',
  '/logMessages',
  '/infrastructure',
  '/configuration',
  '/flowMap',
  '/endpoints'
];

export const v2UsageDurationTracker = createDurationTracker('hybrid.v2');

export function init() {
  initMixpanelCore(mixpanelIsActive => {
    if (mixpanelIsActive) {
      createTracker('pageLoadOrPageReload')();
      initPortalActivityHeartbeat();
      initFineGrainedActivityHeartbeat();
      initUsageDurationTrackers();
      initViewTrackers();
    }
  });
}

/**
 * Send an activity beacon once each hour. This is used by the portal to track which users have used Instana on which
 * day. Just tracking the sign in would not be good enough, since a user can use Instana up to 7 days without signing
 * in again.
 */
function initPortalActivityHeartbeat() {
  const trackActivity = createTracker('user.isActive');
  trackActivity();
  setInterval(trackActivity, 60 * 60 * 1000 /* one hour resolution */);
}

/**
 * Send an activity beacon once every five seconds. PM "needs" this to track usage duration.
 */
function initFineGrainedActivityHeartbeat() {
  const trackActivity = createTracker('user.ping');
  trackActivity();
  setInterval(trackActivity, 5 * 1000 /* 5 second resolution */);
}

function initUsageDurationTrackers() {
  trackV2UsageDuration();
  trackLiveModeUsageDuration();
  trackWindowSizeUsageDuration();
  trackApplicationUsageDuration();
  trackServiceAndEndpointDashboardsVsServiceUsageDuration();
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
      const appId = getAppIdFromLocation(location);
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
          ? getApplication({ id: appId })
              .filter(data => data.progress && !data.progress.loading)
              .map(
                data =>
                  data.errors && data.errors.length > 0
                    ? { data: { label: `unable to load application label for ID ${appId}` } }
                    : data
              )
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

function trackServiceAndEndpointDashboardsVsServiceUsageDuration() {
  if (!twoZeroModeEnabled) {
    return;
  }
  let isCurrentlyInApplicationContext = null;
  let timerIsActive = false;
  const serviceOrEndpointInContextOfApplicationDurationTracker = createDurationTracker(
    'application.serviceOrEndpoint.inApplicationContext'
  );
  navigationParameters$
    .map(location => {
      const isOnServiceOrEndpointDashboard =
        location.pathname &&
        (location.pathname.indexOf('/service/') === 0 || location.pathname.indexOf('/endpoint/') === 0);
      const hasApplicationContext = !!getAppIdFromLocation(location);
      return { isOnServiceOrEndpointDashboard, hasApplicationContext };
    })
    .distinct(
      (
        {
          isOnServiceOrEndpointDashboard: isOnServiceOrEndpointDashboard1,
          hasApplicationContext: hasApplicationContext1
        },
        {
          isOnServiceOrEndpointDashboard: isOnServiceOrEndpointDashboard2,
          hasApplicationContext: hasApplicationContext2
        }
      ) => {
        return (
          isOnServiceOrEndpointDashboard1 !== isOnServiceOrEndpointDashboard2 ||
          hasApplicationContext1 !== hasApplicationContext2
        );
      }
    )
    .subscribe(({ isOnServiceOrEndpointDashboard, hasApplicationContext }) => {
      if (timerIsActive) {
        // stop the timer when leaving service/endpoint dashboards or when leaving the application context
        serviceOrEndpointInContextOfApplicationDurationTracker.stop({
          hasApplicationContext: isCurrentlyInApplicationContext
        });
        timerIsActive = false;
      }
      if (isOnServiceOrEndpointDashboard) {
        // only start a new timer when inside a service/endpoint dashboard application
        isCurrentlyInApplicationContext = hasApplicationContext;
        timerIsActive = true;
        serviceOrEndpointInContextOfApplicationDurationTracker.start();
      }
    });
}

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

function getAppIdFromLocation(location) {
  return (
    get(location, ['matrix', applicationDashboard, applicationId]) ||
    get(location, ['matrix', serviceDashboard, applicationId]) ||
    get(location, ['matrix', endpointDashboard, applicationId]) ||
    get(location, ['matrix', analyze, applicationId]) ||
    null
  );
}

function initViewTrackers() {
  trackView();
  trackOpenDashboardClassic();
}

function trackView() {
  const viewOpenApplicationTracker = createTracker('view.open.applications');
  const viewOpenAnalyzeTracker = createTracker('view.open.analyze');
  const viewOpenComparisonTableTracker = createTracker('view.open.comparisontable');
  const viewOpenEventsTracker = createTracker('view.open.events');
  const viewOpenKubernetesTracker = createTracker('view.open.kubernetes');
  const viewOpenMapTracker = createTracker('view.open.map');
  const viewOpenWebsitesTracker = createTracker('view.open.websites');
  const mapPerspectiveChangeTracker = createTracker('map.perspective.change');

  let lastView = null;
  navigationParameters$
    .map(location => {
      const path = location.pathname || '';
      const matchResult = path.match(/^\/([a-z]+)(?:\/)?([a-z]+)?(?:\/.*)?$/i);
      return { view: matchResult[1], subview: matchResult[2] };
    })
    // opening a (classic) dashboard does not count as a opening a view - those can be accessed in the context of
    // different views (physical, events, ...) but the dashboard content hides the underlying view completely so
    // it does not "feel" like opening the physical, events, ... view.
    .filter(({ subview }) => subview !== 'dashboard')
    .map(({ view }) => view)
    .distinct()
    .subscribe(view => {
      switch (view) {
        case 'analyze':
          viewOpenAnalyzeTracker();
          break;
        case 'application':
        // fall through
        case 'applications':
        // fall through
        case 'endpoint':
        // fall through
        case 'service':
        // fall through
        case 'services':
          if (['application', 'applications', 'endpoint', 'service', 'services'].indexOf(lastView) < 0) {
            viewOpenApplicationTracker();
          }
          break;
        case 'events':
          viewOpenEventsTracker();
          break;
        case 'kubernetes':
          viewOpenKubernetesTracker();
          break;
        case 'website':
        // fall through ("website" is the legacy EUM view)
        case 'websiteMonitoring':
          if (lastView !== 'website' && lastView !== 'websiteMonitoring') {
            viewOpenWebsitesTracker();
          }
          break;
        case 'container':
        // fall through - container and physical are both just variants of the infrastructure map
        case 'physical':
          // eslint-disable-next-line no-case-declarations
          const typeForTracking = view === 'physical' ? 'host' : view;
          if (lastView !== 'physical' && lastView !== 'container') {
            viewOpenMapTracker({ type: typeForTracking });
          } else {
            // Do not create an "open infra map" even if the user simply switched between hosts and containers while
            // being on the map already.
            mapPerspectiveChangeTracker({ type: typeForTracking });
          }
          break;
        case 'table':
          viewOpenComparisonTableTracker();
          break;
      }
      lastView = view;
    });
}

function trackOpenDashboardClassic() {
  const openDashboardClassicTracker = createTracker('dashboard.classic.open');
  navigationParameters$
    .map(location => {
      const matrix = location.matrix;
      if (!matrix || !matrix[classicDashboard] || !location.pathname) {
        return null;
      }
      const snapshotId = location && location.query ? location.query.snapshotId : null;
      if (snapshotId == null) {
        return null;
      }
      return { contextPath: location.pathname, snapshotId };
    })
    .filter(value => value != null)
    .flatMap(({ contextPath, snapshotId }) => {
      return combineLatest([just(contextPath), getSnapshot(snapshotId)]);
    })
    .subscribe(([contextPath, snapshot]) => {
      openDashboardClassicTracker({ context: contextPath, entityType: snapshot.get('plugin') });
    });
}
