import { get } from 'lodash';

import { applicationDashboard, endpointDashboard, serviceDashboard } from 'in-applications/navigation/paths';
import { createDurationTracker, init as initMixpanelCore } from 'in-services/tracking/mixpanel';
import { classicDashboard } from 'in-stores/navigation/paths/dashboardPaths';
import getApplication from 'in-subscription/application/getApplication';
import { applicationId } from 'in-applications/navigation/matrix';
import { trackUrlPathChanges } from 'in-services/featureFlags';
import { navigationParameters$ } from 'in-stores/navigation';
import { combineLatest, just } from 'reactive-observables';
import { analyze } from 'in-analyze/navigation/paths';
import { track } from 'in-services/tracking/tracking';
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
      track('pageLoadOrPageReload');
      initUsageDurationTrackers();
      initViewTrackers();
    }
  });
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
  // will be stopped in VersionSwitcher immediately before page reload to switch v2 mode
  v2UsageDurationTracker.start();
}

function trackLiveModeUsageDuration() {
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
  trackPathChanges();
  trackOpenDashboardClassic();
}

function trackPathChanges() {
  if (!trackUrlPathChanges) {
    return;
  }

  let prevPath = null;
  navigationParameters$.subscribe(location => {
    // We deliberately only want to track path changes while ignoring query / matrix parameter changes
    if (location.pathname !== prevPath) {
      prevPath = location.pathname;
      track('url.path.change');
    }
  });
}

function trackView() {
  let lastView = null;
  navigationParameters$
    .map(location => {
      const path = location.pathname || '';
      return path.match(/^\/([a-z]+)(?:\/)?([a-z]+)?(?:\/.*)?$/i);
    })
    .filter(Boolean)
    .map(matchResult => ({ view: matchResult[1], subview: matchResult[2] }))
    // opening a (classic) dashboard does not count as a opening a view - those can be accessed in the context of
    // different views (physical, events, ...) but the dashboard content hides the underlying view completely so
    // it does not "feel" like opening the physical, events, ... view.
    .filter(({ subview }) => subview !== 'dashboard')
    .map(({ view }) => view)
    .distinct()
    .subscribe(view => {
      switch (view) {
        case 'analyze':
          track('view.open.analyze');
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
            track('view.open.applications');
          }
          break;
        case 'events':
          track('view.open.events');
          break;
        case 'kubernetes':
          track('view.open.kubernetes');
          break;
        case 'website':
        // fall through ("website" is the legacy EUM view)
        case 'websiteMonitoring':
          if (lastView !== 'website' && lastView !== 'websiteMonitoring') {
            track('view.open.websites');
          }
          break;
        case 'container':
        // fall through - container and physical are both just variants of the infrastructure map
        case 'physical':
          // eslint-disable-next-line no-case-declarations
          const typeForTracking = view === 'physical' ? 'host' : view;
          if (lastView !== 'physical' && lastView !== 'container') {
            track('view.open.map', { type: typeForTracking });
          } else {
            // Do not create an "open infra map" even if the user simply switched between hosts and containers while
            // being on the map already.
            track('map.perspective.change', { type: typeForTracking });
          }
          break;
        case 'table':
          track('view.open.comparisontable');
          break;
      }
      lastView = view;
    });
}

function trackOpenDashboardClassic() {
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
      track('dashboard.classic.open', { context: contextPath, entityType: snapshot.get('plugin') });
    });
}
