/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ApdexConfiguration } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { getApdexConfigurationsByEntity } from 'in-custom-dashboards/widgets/Apdex/api';
import { ApdexEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import { FetchedState } from 'in-hooks/utils/types';
import { isBlank } from 'in-services/util/string';
import { error } from 'in-services/util/result';

export default function useApdexConfigurations(
  entityType: ApdexEntityTypes,
  entityId: string
): FetchedState<Array<ApdexConfiguration>> {
  const result = useObservable(() => {
    if (isBlank(entityType)) {
      return just(
        error<ApdexConfiguration[]>([{ code: 'CLIENT', message: 'EntityType cannot be blank' }])
      );
    }
    if (isBlank(entityId)) {
      return just(
        error<ApdexConfiguration[]>([{ code: 'CLIENT', message: 'EntityId cannot be blank' }])
      );
    }

    return getApdexConfigurationsByEntity({ entityType, entityId });
  }, [entityType, entityId]);
  return resultToFetchedStateResponse(result);
}
