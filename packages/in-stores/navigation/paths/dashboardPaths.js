/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { navigationParameters$, mutateUrl, getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { urlQueryKeys, setTimeConfig } from 'in-stores/time/config';
import { emptyObject } from 'in-services/fixedObjects';

export const classicDashboard = '/dashboard';

export function goToDashboard(snapshotId) {
  mutateUrl(params => {
    const view = getActiveView(params);
    params.pathname = `/${view}${classicDashboard}`;
    params.query.snapshotId = snapshotId;
    return params;
  });
}

export function getDashboardLink(
  snapshotId,
  { windowSize, to, focusedMoment, pathname, autoRefresh, timeConfig } = {}
) {
  return getModifiedUrlStream(params => {
    if (pathname) {
      params.pathname = pathname;
    } else {
      const view = getActiveView(params);
      params.pathname = `/${view}${classicDashboard}`;
    }
    if (windowSize != null) {
      params.query[urlQueryKeys.windowSize] = windowSize;
    }
    if (to !== undefined) {
      params.query[urlQueryKeys.to] = to == null ? '' : to;
    }
    if (focusedMoment !== undefined) {
      params.query[urlQueryKeys.focusedMoment] = focusedMoment == null ? '' : focusedMoment;
    }
    if (autoRefresh !== undefined) {
      params.query[urlQueryKeys.autoRefresh] = String(Boolean(autoRefresh));
    }
    if (timeConfig) {
      setTimeConfig(params, timeConfig);
    }
    params.query.snapshotId = snapshotId;
  });
}

export const isDashboardOpen$ = navigationParameters$
  .map(params => {
    return /\/[a-z]+\/dashboard/i.test(params.pathname);
  })
  .distinct();

export function getCloseDashboardLink() {
  return getModifiedUrlStream(params => {
    params.pathname = params.pathname.replace(/\/dashboard/i, '');
  });
}

function getActiveView(params) {
  return params.pathname.replace(/\/dashboard($|\/.*)/, '').replace(/^\//, '');
}

export function getLinkToSnapshotInCurrentView(snapshotId, { timeConfig } = emptyObject) {
  return getModifiedUrlStream(params => {
    params.query.snapshotId = snapshotId;

    if (timeConfig) {
      setTimeConfig(params, timeConfig);
    }
  });
}
