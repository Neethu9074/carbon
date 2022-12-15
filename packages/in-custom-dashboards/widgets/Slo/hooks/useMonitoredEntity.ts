/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import getApplication from 'in-applications/subscriptions/getApplication';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { Application, Result, Website } from 'in-types';
import { FetchedState } from 'in-hooks/utils/types';
import { isBlank } from 'in-services/util/string';
import { error } from 'in-services/util/result';

export type MonitoredEntity = Application | Website;

interface UseMonitoredEntityRequest {
  entityId: string;
  entityType: MonitoringSource;
}

export default function useMonitoredEntity({
  entityId,
  entityType
}: UseMonitoredEntityRequest): FetchedState<MonitoredEntity> {
  const result = useObservable(() => loadEntity(entityType, entityId), [entityType, entityId]);
  return resultToFetchedStateResponse(result);
}

function loadEntity(entityType: MonitoringSource, entityId: string): Observable<Result<MonitoredEntity>> {
  if (isBlank(entityType)) {
    return just(error([{ code: 'CLIENT', message: 'EntityType cannot be blank' }]));
  }

  if (isBlank(entityId)) {
    return just(error([{ code: 'CLIENT', message: 'EntityId cannot be blank' }]));
  }

  switch (entityType) {
    case 'application':
      return getApplication({ id: entityId });

    case 'website':
      return getWebsite({ id: entityId });
  }
}
