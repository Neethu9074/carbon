/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import getApplication from 'in-applications/subscriptions/getApplication';
import { Application, Nullish, Result, Website } from 'in-types';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { pendingResult } from 'in-services/fixedObjects';

interface UseSloEntityRequest {
  entityId: string;
  entityType: MonitoringSource;
}
type SloEntity = Application | Website;

export default function useSloEntity({ entityId, entityType }: UseSloEntityRequest): Result<SloEntity> | Nullish {
  return useObservable(() => loadEntity(entityType, entityId), [entityType, entityId]) ?? pendingResult;
}

function loadEntity(entityType: MonitoringSource, entityId: string): Observable<Result<SloEntity>> {
  switch (entityType) {
    case 'application':
      return getApplication({ id: entityId });

    case 'website':
      return getWebsite({ id: entityId });
  }
}
