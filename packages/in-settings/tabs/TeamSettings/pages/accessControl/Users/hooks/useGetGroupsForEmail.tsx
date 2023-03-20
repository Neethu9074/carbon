/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { FetchedState } from 'in-hooks/utils/types';
import { deepCopy } from 'in-services/util/object';
import { Result, GroupWithRoles } from 'in-types';
import http from 'in-services/http';

const basePath = '/api/settings/rbac/groups';

export const useGetGroupsForEmail = (email: string): FetchedState<GroupWithRoles[]> => {
  const result = useObservable(() => {
    return getGroupsOfASingleUserAsResult(email).map(({ data, ...rest }) => {
      return {
        data: data ? deepCopy(data) : [],
        ...rest
      };
    });
  }, [getGroupsOfASingleUserAsResult]);
  return resultToFetchedStateResponse(result);
};

function getGroupsOfASingleUserAsResult(email: string): Observable<Result<GroupWithRoles[]>> {
  return http<GroupWithRoles[]>({
    method: 'GET',
    maxRetries: 3,
    url: `${basePath}/user/${email}`,
    mapToResultObject: true
  });
}
