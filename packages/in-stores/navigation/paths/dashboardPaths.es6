import { navigationParameters$, mutateUrl, getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { urlQueryKeys } from 'in-stores/time/config';

export function goToDashboard(snapshotId) {
  mutateUrl(params => {
    const view = getActiveView(params);
    params.pathname = `/${view}/dashboard`;
    params.query.snapshotId = snapshotId;
    return params;
  });
}

export function getDashboardLink(snapshotId, { windowSize, to, focusedMoment, pathname } = {}) {
  return getModifiedUrlStream(params => {
    if (pathname) {
      params.pathname = pathname;
    } else {
      const view = getActiveView(params);
      params.pathname = `/${view}/dashboard`;
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
