/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  isApplicationSloEntity,
  isWebsiteSloEntity,
  ServiceLevelObjectiveConfiguration,
  SloEntity,
  SloEntityType
} from '@instana/types';
import { combineLatest, just, Observable } from '@instana/observables';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getApplication from 'in-applications/subscriptions/getApplication';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { pendingResult } from 'in-services/fixedObjects';
import { LabeledEntity } from 'in-service-levels/types';
import { Application, Result, Website } from 'in-types';
import { FetchedState } from 'in-hooks/utils/types';
import { isBlank } from 'in-services/util/string';
import { error } from 'in-services/util/result';
import { all } from 'in-hooks/utils/progress';

export type MonitoredEntity = Application | Website;

export default function useSloEntitiesLabels(
  configurations: ServiceLevelObjectiveConfiguration[]
): FetchedState<Record<string, LabeledEntity>> {
  const results = useObservable(
    () => combineLatest(configurations.map(({ id, entity }) => loadEntity(entity).map(res => [id, res] as const))),
    [generateStableHash(configurations.map(c => c.id))]
  );

  if (!results) {
    return resultToFetchedStateResponse(pendingResult);
  }

  const result: Result<Record<string, LabeledEntity>> = {
    progress: all(...results.map(r => r[1].progress)),
    errors: results.flatMap(r => r[1].errors),
    data: results.reduce((acc, [id = '', r]) => {
      acc[id] = r.data ?? { label: '' };
      return acc;
    }, {} as Record<string, LabeledEntity>)
  };
  return resultToFetchedStateResponse(result);
}

export function loadEntity(entity: SloEntity): Observable<Result<MonitoredEntity>> {
  let id = '';
  if (isApplicationSloEntity(entity)) {
    id = entity.applicationId;
  } else if (isWebsiteSloEntity(entity)) {
    id = entity.websiteId;
  }
  return loadEntityByTypeAndId(entity.type, id);
}

export function loadEntityByTypeAndId(
  entityType: SloEntityType,
  entityId: string
): Observable<Result<MonitoredEntity>> {
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
