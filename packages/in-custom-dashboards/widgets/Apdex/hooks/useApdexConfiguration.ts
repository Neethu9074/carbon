/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getApdexConfigurationById } from 'in-custom-dashboards/widgets/Apdex/api';
import { FetchedState } from 'in-hooks/utils/types';
import { ApdexConfiguration } from 'in-types';

export default function useApdexConfiguration(id: string): FetchedState<ApdexConfiguration> {
  const result = useObservable(() => getApdexConfigurationById(id), [id]);
  return resultToFetchedStateResponse(result);
}
