import { create } from 'reactive-observables';

import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

// observables

export const getAccountAsResultObservable = memoize(getAccountAsResultObservableInternal, () => '', 60000);
function getAccountAsResultObservableInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/amp/account`
      })
    )
  );
}

export const getLicensesAsResultObservable = memoize(getLicensesAsResultObservableInternal, page => page, 60000);
function getLicensesAsResultObservableInternal(page, pageSize) {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/amp/account/licenses`,
        queryParams: { page, pageSize }
      })
    )
  );
}

export const getQueuedLicensesAsResultObservable = memoize(
  getQueuedLicensesAsResultObservableInternal,
  page => page,
  60000
);
function getQueuedLicensesAsResultObservableInternal(page, pageSize) {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/amp/account/queuedLicenses`,
        queryParams: { page, pageSize }
      })
    )
  );
}
