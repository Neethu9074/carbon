/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { WebsiteConfiguration } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getWebsiteConfigurations } from 'in-websites/api/websites';
import { compareIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';
import { deepCopy } from 'in-services/util/object';

export const useWebsiteConfigurations = (): FetchedState<WebsiteConfiguration[]> => {
  const result = useObservable(() => {
    return getWebsiteConfigurations().map(({ data, ...rest }) => {
      const newData = data ? deepCopy(data) : [];
      return {
        data: newData.sort((a, b) => compareIgnoreCase(a.name, b.name)),
        ...rest
      };
    });
  }, [getWebsiteConfigurations]);
  return resultToFetchedStateResponse(result);
};
