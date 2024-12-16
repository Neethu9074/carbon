/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getApplicationConfigsAsResult } from 'in-api/applicationConfigs';
import { compareIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';
import { deepCopy } from 'in-services/util/object';
import { ApplicationConfig } from 'in-types';

export const useApplicationsConfigurations = (): FetchedState<ApplicationConfig[]> => {
  const result = useObservable(() => {
    return getApplicationConfigsAsResult().map(({ data, ...rest }) => {
      const newData = data ? deepCopy(data) : [];
      return {
        data: newData.sort((a, b) => compareIgnoreCase(a.label, b.label)),
        ...rest
      };
    });
  }, [getApplicationConfigsAsResult]);
  return resultToFetchedStateResponse(result);
};
