import { create } from 'reactive-observables';

import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const refreshSignal = create().emit(true);

export const getUsersAsResultObservable = memoize(getUsersAsResultObservableInternal, () => '', 60000);
function getUsersAsResultObservableInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: '/api/settings/authentication/2fa/users'
      })
    )
  );
}
