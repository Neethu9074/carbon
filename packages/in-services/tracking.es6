import { assign, get } from 'lodash';

import { applicationDashboard, serviceDashboard, endpointDashboard } from 'in-applications/navigation/paths';
import { isTwoZeroBetaPhase, twoZeroModeEnabled } from 'in-services/featureFlags';
import getApplication from 'in-subscription/application/getApplication';
import { applicationId } from 'in-applications/navigation/matrix';
import { navigationParameters$ } from 'in-stores/navigation';
import { analyze } from 'in-analyze/navigation/paths';
import { urlQueryKeys } from 'in-stores/time/config';
import { getTenantsWithUnits } from 'in-api/account';
import { noop } from 'in-services/util/function';
import { find } from 'in-services/arrayUtils';
import { tenant, user } from 'in-stores/user';
import { config } from 'in-services/config';
import { just } from 'reactive-observables';

const mixpanel = window.mixpanel;
const sharedTransmitterProperties = {
  token: config.mixpanelToken
};
const registeredTrackers = [];

export const v2UsageDurationTracker = createDurationTracker('hybrid.v2');

export function init() {
  if (mixpanel) {
    initMixpanel();
    initUsageDurationTrackers();
    initActivityHeartbeat();
  }
}

function initMixpanel() {
  mixpanel.identify(user.id);
  mixpanel.register({
    tenantId: tenant.id
  });
  getTenantsWithUnits().once(tenantWithUnits => {
    const units = tenantWithUnits[tenant.name];
    if (!units) {
      return;
    }
    const currentUnit = find(units, unit => (unit.name = config.tenantUnit));
    if (!currentUnit) {
      return;
    }
    mixpanel.register({
      tenantUnitId: currentUnit.id
    });
  });

  // give getTenantsWithUnits a chance to complete before logging the page load/page reload event
  setTimeout(() => {
    mixpanel.track('pageLoadOrPageReload');
  }, 10000);
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
  trackDashboardTabUsageDuration();
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
    .map(
      location =>
        get(location, ['matrix', applicationDashboard, applicationId]) ||
        get(location, ['matrix', serviceDashboard, applicationId]) ||
        get(location, ['matrix', endpointDashboard, applicationId]) ||
        get(location, ['matrix', analyze, applicationId]) ||
        null
    )
    .distinct()
    .flatMap(
      appId =>
        appId
          ? getApplication({ id: appId }).skipUntil(data => data.progress && !data.progress.loading)
          : just({ data: { label: 'no application context' } })
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

function trackDashboardTabUsageDuration() {
  if (!twoZeroModeEnabled) {
    return;
  }
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
  let currentTab = null;
  const dashboardTabUsageDurationTracker = createDurationTracker('dashboard.tab');
  navigationParameters$
    .map(location => {
      const matrix = location.matrix;
      if (!matrix) {
        return null;
      }
      for (let i = 0; i < tabNames.length; i++) {
        if (matrix[tabNames[i]]) {
          return tabNames[i];
        }
      }
      return null;
    })
    .distinct()
    .subscribe(tab => {
      if (currentTab) {
        dashboardTabUsageDurationTracker.stop({ tab: currentTab });
      }
      currentTab = tab;
      dashboardTabUsageDurationTracker.start();
    });
}

export function createTracker(event, defaultProperties = {}) {
  if (registeredTrackers.indexOf(event) >= 0) {
    throw new Error(`Tracker names must be unique, ${event} has already been registered.`);
  }
  registeredTrackers.push(event);
  if (!mixpanel || !config.mixpanelToken) {
    return noop;
  }
  return props => mixpanel.track(event, assign({}, props, defaultProperties, sharedTransmitterProperties));
}

export function createDurationTracker(event, defaultProperties = {}) {
  if (registeredTrackers.indexOf(event) >= 0) {
    throw new Error(`Tracker names must be unique, ${event} has already been registered.`);
  }
  registeredTrackers.push(event);
  if (!mixpanel || !config.mixpanelToken) {
    return {
      start: noop,
      stop: noop
    };
  }

  return {
    start: () => mixpanel.time_event(event),
    stop: props => mixpanel.track(event, assign({}, props, defaultProperties, sharedTransmitterProperties))
  };
}
