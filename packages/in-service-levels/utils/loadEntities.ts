/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { SloEntityUnion, SyntheticTest, Application, Result, Website } from '@instana/types';
import { just, Observable } from '@instana/observables';

import getApplication from 'in-applications/subscriptions/getApplication';
import { getFilteredSyntheticTests } from 'in-synthetics/api';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { mapData } from 'in-services/util/result';
import { isBlank } from 'in-services/util/string';
import { error } from 'in-services/util/result';

type LoadSyntheticEntityParams = { entityType: 'synthetic'; entityIds: string[]; entityId?: never };
type LoadApplicationWebsiteParams = { entityType: 'application' | 'website'; entityId: string; entityIds?: never };
type LoadEntityByTypeAndIdParams = LoadSyntheticEntityParams | LoadApplicationWebsiteParams;
export type MonitoredEntity = Application | Website | SyntheticTest;

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
}: LoadSyntheticEntityParams): Observable<Result<MonitoredEntity[]>>;
export function loadEntityByTypeAndId({
  entityType,
  entityId,
  entityIds
}: LoadApplicationWebsiteParams): Observable<Result<MonitoredEntity>>;
export function loadEntityByTypeAndId({
  entityType,
  entityId,
  entityIds
}: LoadEntityByTypeAndIdParams): Observable<Result<MonitoredEntity>> | Observable<Result<MonitoredEntity[]>> {
  if (isBlank(entityType)) {
    return just(error<MonitoredEntity>([{ code: 'CLIENT', message: 'EntityType cannot be blank' }]));
  }

  if (entityType !== 'synthetic' && isBlank(entityId)) {
    return just(error<MonitoredEntity>([{ code: 'CLIENT', message: 'EntityId cannot be blank' }]));
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
