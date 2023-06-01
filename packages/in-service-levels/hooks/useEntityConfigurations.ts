/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Application, SloEntityType, Website } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getApplicationConfigsAsResult } from 'in-api/applicationConfigs';
import { getWebsiteConfigurations } from 'in-websites/api/websites';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import { FetchedState } from 'in-hooks/utils/types';
import { deepCopy } from 'in-services/util/object';

export const useEntityConfigurations = (monitoringSource?: SloEntityType): FetchedState<Website[] | Application[]> => {
  const getEntityConfiguration =
    monitoringSource == 'application' ? getApplicationConfigsAsResult : getWebsiteConfigurations;

  const result = useObservable(() => {
    if (!monitoringSource) return just(pendingResult);
    return getEntityConfiguration().map(({ data, ...rest }: any) => {
      const newData = data ? deepCopy(data) : [];
      const normalizedData = newData.map(({ id, ...config }: any) => {
        const label = 'label' in config ? config.label : config.name;
        return { id, label };
      });
      const sortedData = normalizedData.sort((a: { label: string }, b: { label: string }) =>
        compareIgnoreCase(a.label, b.label)
      );
      return {
        data: sortedData,
        ...rest
      };
    });
  }, [getEntityConfiguration]);
  return resultToFetchedStateResponse(result);
};
