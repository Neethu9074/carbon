/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getSyntheticTestsAsResult } from 'in-synthetics/api';
import { compareIgnoreCase } from 'in-services/util/string';
import { FetchedState } from 'in-hooks/utils/types';
import { deepCopy } from 'in-services/util/object';
import { SyntheticTest } from 'in-types';

export const useSyntheticTests = (): FetchedState<SyntheticTest[]> => {
  const result = useObservable(() => {
    return getSyntheticTestsAsResult().map(({ data, ...rest }) => {
      const newData = data ? deepCopy(data) : [];
      return {
        data: newData.sort((a, b) => compareIgnoreCase(a.label, b.label)),
        ...rest
      };
    });
  }, [getSyntheticTestsAsResult]);
  return resultToFetchedStateResponse(result);
};
