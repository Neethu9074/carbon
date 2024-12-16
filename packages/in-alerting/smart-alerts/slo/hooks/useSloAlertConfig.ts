/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ServiceLevelsAlertConfigWithMetadata } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { getSloAlertConfiguration } from 'in-alerting/smart-alerts/slo/api/sloAlertConfig';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { FetchedState } from 'in-hooks/utils/types';

interface UseSloAlertConfigProps {
  id: string;
}

export default function useSloAlertConfig({
  id
}: UseSloAlertConfigProps): FetchedState<ServiceLevelsAlertConfigWithMetadata> {
  const result = useObservable(() => getSloAlertConfiguration(id), [id]);
  return resultToFetchedStateResponse(result);
}
