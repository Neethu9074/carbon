import { create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { success, hasError, isLoading } from 'in-services/util/result';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const refreshSignalTeams = create().emit(true);
export function refresh() {
  refreshSignalTeams.emit(true);
}

// observables

export const getKubernetesNamespacesAsResultObservable = memoize(
  getKubernetesNamespacesAsResultObservableInternal,
  () => '',
  60000
);
function getKubernetesNamespacesAsResultObservableInternal() {
  return refreshSignalTeams
    .flatMap(() =>
      createObservable(
        http({
          method: 'POST',
          maxRetries: 3,
          headers: getCsrfHeader(),
          url: '/api/kubernetes/namespaces',
          data: defaultQuery()
        })
      )
    )
    .map(result =>
      hasError(result) || isLoading(result)
        ? result
        : success(result.data.items.map(({ id, namespace }) => ({ id, label: namespace.label })))
    );
}

function defaultQuery() {
  return {
    filter: { timeConfig: {} },
    pagination: { page: 1, pageSize: 200 },
    order: { by: 'label', direction: 'ASC' }
  };
}
