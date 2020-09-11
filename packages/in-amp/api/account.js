import { create } from 'reactive-observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
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

// regular calls

export function setCompanyInfo(account) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: `/api/settings/amp/account`,
    headers: getCsrfHeader(),
    data: account
  }).map(v => {
    refreshSignal.emit(account);
    return v;
  });
}
