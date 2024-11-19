/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  isApplicationSloEntity,
  isSyntheticSloEntity,
  isWebsiteSloEntity,
  ServiceLevelObjectiveConfiguration,
  SloEntity,
  SloEntityType,
  SloEntityUnion,
  SyntheticTest
} from '@instana/types';
import { combineLatest, just, Observable } from '@instana/observables';
import { generateStableHash } from '@instana/utils';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import getSyntheticTest from 'in-synthetics/subscriptions/getSyntheticTest';
import getApplication from 'in-applications/subscriptions/getApplication';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { pendingResult } from 'in-services/fixedObjects';
import { error, success } from 'in-services/util/result';
import { LabeledEntity } from 'in-service-levels/types';
import { Application, Result, Website } from 'in-types';
import { FetchedState } from 'in-hooks/utils/types';
import { isBlank } from 'in-services/util/string';
import { all } from 'in-hooks/utils/progress';

export type MonitoredEntity = Application | Website | SyntheticTest;

export default function useSloEntitiesLabels(
  configurations: ServiceLevelObjectiveConfiguration[]
): FetchedState<Record<string, LabeledEntity[]>> {
  const results = useObservable(
    () =>
      combineLatest(
        configurations.map(({ id, entity }) =>
          loadEntities(entity.type, getEntityIds(entity)).map(res => [id, res] as const)
        )
      ),
    [generateStableHash(configurations.map(c => c.id))]
  );

  if (!results) {
    return resultToFetchedStateResponse(pendingResult);
  }

  const result: Result<Record<string, LabeledEntity[]>> = {
    progress: all(...results.map(r => r[1].progress)),
    // If an entity got deleted we get a NOT_FOUND error for labels from the backend and the status will be rejected.
    // However, the NOT_FOUND error is an expected error that can happen and we should display the SLO list anyway.
    errors: results.flatMap(r => r[1].errors.filter(({ code }) => code !== 'NOT_FOUND')),
    data: results.reduce((acc, [id = '', r]) => {
      const entityNotFoundErrors = r.errors.filter(({ code }) => code === 'NOT_FOUND');
      const hasEntityNotFoundErrors = entityNotFoundErrors.length > 0;
      const hasData = r.data != null && r.data.length > 0;
      const labeledEntities: LabeledEntity[] = hasData
        ? r.data.map(({ id, label }) => ({ id: id ?? '', label, deleted: hasEntityNotFoundErrors }))
        : [
            {
              id: '',
              label: entityNotFoundErrors
                ? t('in-service-levels:general.entityTypes.label', { context: 'unknown' })
                : '',
              deleted: hasEntityNotFoundErrors
            }
          ];
      const currentEntities = acc[id] ?? [];
      const newEntities = [...currentEntities, ...labeledEntities];
      return {
        ...acc,
        [id]: newEntities
      };
    }, {} as Record<string, LabeledEntity[]>)
  };
  return resultToFetchedStateResponse(result);
}

function getEntityIds(entity: SloEntityUnion): string[] {
  if (isApplicationSloEntity(entity)) return [entity.applicationId];

  if (isWebsiteSloEntity(entity)) return [entity.websiteId];

  if (isSyntheticSloEntity(entity)) return entity.syntheticTestIds;

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
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

    case 'synthetic':
      return getSyntheticTest({ testId: entityId });
  }
}

export function loadEntities(entityType: SloEntityType, entityIds: string[]): Observable<Result<MonitoredEntity[]>> {
  return combineLatest(entityIds.map(id => loadEntityByTypeAndId(entityType, id))).flatMap(results => {
    return just(
      results.reduce<Result<MonitoredEntity[]>>(
        (acc, result) => ({
          ...acc,
          errors: [...acc.errors, ...result.errors],
          progress: all(acc.progress, result.progress),
          data: acc.data && result.data ? [...acc.data, result.data] : acc.data
        }),
        success<MonitoredEntity[]>([])
      )
    );
  });
}
