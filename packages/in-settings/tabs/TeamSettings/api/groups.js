import { create } from 'reactive-observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const refreshSignalTeams = create().emit(true);
export function refresh() {
  refreshSignalTeams.emit(true);
}

// observables

export const getGroupsAsResultObservable = memoize(getGroupsAsResultObservableInternal, () => '', 60000);
function getGroupsAsResultObservableInternal() {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/groups`
      })
    )
  );
}

// regular calls

export function saveGroup(group) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: '/api/settings/group',
    data: group
  }).map(response => {
    refresh();
    return response.body;
  });
}

export function saveGroups(groups) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: '/api/settings/groups',
    data: groups
  }).map(response => {
    refresh();
    return response.body;
  });
}
