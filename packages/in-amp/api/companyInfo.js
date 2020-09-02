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

export const getCompanyInfoAsResultObservable = memoize(getCompanyInfoAsResultObservableInternal, () => '', 60000);
function getCompanyInfoAsResultObservableInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/amp/companyInfo`
      })
    )
  );
}

// regular calls

export function setCompanyInfo(companyInfo) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: `/api/settings/amp/companyInfo`,
    headers: getCsrfHeader(),
    data: companyInfo
  }).map(v => {
    refreshSignal.emit(companyInfo);
    return v;
  });
}
