/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';

import { getSliConfigurationsByEntity } from 'in-custom-dashboards/widgets/SloLegacy/sli/api';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { MonitoringSource } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import { SliConfigurationWithLastUpdated } from 'in-types';
import { FetchedState } from 'in-hooks/utils/types';
import { isBlank } from 'in-services/util/string';
import { error } from 'in-services/util/result';

export default function useSliConfigurations(
  entityType: MonitoringSource,
  entityId: string
): FetchedState<SliConfigurationWithLastUpdated[]> {
  const result = useObservable(() => loadEntities(entityType, entityId), [entityType, entityId]);
  return resultToFetchedStateResponse(result);
}

function loadEntities(
  entityType: MonitoringSource,
  entityId: string
): Observable<Result<SliConfigurationWithLastUpdated[]>> {
  if (isBlank(entityType)) {
    return just(error([{ code: 'CLIENT', message: 'EntityType cannot be blank' }]));
  }

  if (isBlank(entityId)) {
    return just(error([{ code: 'CLIENT', message: 'EntityId cannot be blank' }]));
  }

  return getSliConfigurationsByEntity({ entityType, entityId });
}
