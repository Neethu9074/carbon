/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { SloEntityUnion, Result } from '@instana/types';
import { just, Observable } from '@instana/observables';

import getApplication from 'in-applications/subscriptions/getApplication';
import { getFilteredSyntheticTests } from 'in-synthetics/api';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { SloMonitoredEntity } from 'in-service-levels/types';
import { mapData, error } from 'in-services/util/result';
import { isBlank } from 'in-services/util/string';

type LoadSyntheticEntityParams = { entityType: 'synthetic'; entityIds: string[]; entityId?: never };
type LoadApplicationWebsiteParams = { entityType: 'application' | 'website'; entityId: string; entityIds?: never };
type LoadEntityByTypeAndIdParams = LoadSyntheticEntityParams | LoadApplicationWebsiteParams;

export function loadEntities(entity: SloEntityUnion) {
  const { type: entityType } = entity;

  switch (entityType) {
    case 'application':
      return loadEntityByTypeAndId({ entityType, entityId: entity.applicationId }).map(res =>
        mapData(res, data => [data])
      );
    case 'website':
      return loadEntityByTypeAndId({ entityType, entityId: entity.websiteId }).map(res => mapData(res, data => [data]));
    case 'synthetic':
      return loadEntityByTypeAndId({ entityType, entityIds: entity.syntheticTestIds });
  }
}

export function loadEntityByTypeAndId({
  entityType,
  entityId,
  entityIds
}: LoadSyntheticEntityParams): Observable<Result<SloMonitoredEntity[]>>;
export function loadEntityByTypeAndId({
  entityType,
  entityId,
  entityIds
}: LoadApplicationWebsiteParams): Observable<Result<SloMonitoredEntity>>;
export function loadEntityByTypeAndId({
  entityType,
  entityId,
  entityIds
}: LoadEntityByTypeAndIdParams): Observable<Result<SloMonitoredEntity>> | Observable<Result<SloMonitoredEntity[]>> {
  if (isBlank(entityType)) {
    return just(error<SloMonitoredEntity>([{ code: 'CLIENT', message: 'EntityType cannot be blank' }]));
  }

  if (entityType !== 'synthetic' && isBlank(entityId)) {
    return just(error<SloMonitoredEntity>([{ code: 'CLIENT', message: 'EntityId cannot be blank' }]));
  }

  switch (entityType) {
    case 'application':
      return getApplication({ id: entityId });

    case 'website':
      return getWebsite({ id: entityId });

    case 'synthetic':
      return getFilteredSyntheticTests(entityIds);
  }
}
