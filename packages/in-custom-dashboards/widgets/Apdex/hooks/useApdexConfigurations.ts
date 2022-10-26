/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ApdexConfiguration } from '@instana/types';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getApdexConfigurationsByEntity } from 'in-custom-dashboards/widgets/Apdex/api';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { FetchedState } from 'in-hooks/utils/types';

export default function useApdexConfigurations(
  entityType: ApdexEntityTypes,
  entityId: string
): FetchedState<Array<ApdexConfiguration>> {
  const result = useObservable(() => getApdexConfigurationsByEntity({ entityType, entityId }), [entityType, entityId]);
  return resultToFetchedStateResponse(result);
}
