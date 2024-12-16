/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import { loadEntityByTypeAndId, MonitoredEntity } from 'in-service-levels/hooks/useSloEntitiesLabels';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { MonitoringSource } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import { FetchedState } from 'in-hooks/utils/types';

interface UseMonitoredEntityRequest {
  entityId: string;
  entityType: MonitoringSource;
}

export default function useMonitoredEntity({
  entityId,
  entityType
}: UseMonitoredEntityRequest): FetchedState<MonitoredEntity> {
  const result = useObservable(() => loadEntityByTypeAndId(entityType, entityId), [entityType, entityId]);
  return resultToFetchedStateResponse(result);
}
