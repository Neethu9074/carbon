/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { List } from 'immutable';

import { Error, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import determineEntityTypeFromEntityIDMap from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import { EntityIdWithSnapshotId } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/NewTopology/types';
import getIncidentTimeConfig from 'in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig';
import createSnapshotObservable from 'in-events/components/RootCauseAnalysis/utils/modifiedSnapshot';
import { useIncident } from 'in-events/components/providers/IncidentProvider';
// @ts-expect-error
import { getSnapshotVersions } from 'in-stores/snapshot';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';

/**
 * Finds the snapshot version that best matches the target time
 * @param versions - Array of snapshot versions with from and to timestamps
 * @param targetTime - The target timestamp to match against
 * @returns The best matching version
 */
function findBestMatchingVersion(
  versions: { to: number; from: number }[],
  targetTime: number
): { to: number; from: number } {
  let bestMatchVersion = versions[0];
  let minTimeDiff = Number.MAX_SAFE_INTEGER;

  for (const version of versions) {
    const versionTime = version.to || Date.now();
    const timeDiff = Math.abs(versionTime - targetTime);

    if (timeDiff < minTimeDiff) {
      minTimeDiff = timeDiff;
      bestMatchVersion = version;
    }
  }

  return bestMatchVersion;
}

/**
 * Hook to get entity label based on entity type and ID
 * @param entity - The entity with ID and snapshot ID
 * @returns The entity data (Snapshot, Endpoint, ServiceLabel, Application) or null
 */
function useGetEntityLabel(entity: EntityIdWithSnapshotId): {
  label: string;
  loading: boolean;
  error?: Error[];
} {
  // Determine entity type using the utility function with type assertion
  // This is necessary because EntityIdWithSnapshotId has optional fields while EntityId requires them
  const entityType = determineEntityTypeFromEntityIDMap(entity);

  const id = entityType === 'infrastructure' || entityType === 'process' ? entity.snapshotId : entity.steadyId;
  const { incident } = useIncident();
  // Default time window for API calls
  const timeWindow = getIncidentTimeConfig(incident);

  // For infrastructure entities, first get the new time window from snapshot versions
  const shouldRunInfra = entityType === 'infrastructure' || entityType === 'process';

  // 1. Get the new time window from snapshot versions
  const newTimeWindow = useObservable<TimeConfig | null, any[]>(
    shouldRunInfra
      ? getSnapshotVersions(id).map((versions: List<string>) => {
          if (List.isList(versions) && versions.size > 0) {
            const versionsJS: { to: number; from: number }[] = versions.toJS();

            // Use timeWindow.focusedMoment or timeWindow.to as the target time
            const targetTime = timeWindow.focusedMoment || timeWindow.to || Date.now();

            // Find the version that best matches the timeWindow using our utility function
            const bestMatchVersion = findBestMatchingVersion(versionsJS, targetTime);

            const { to, from } = bestMatchVersion;
            return {
              windowSize: (to || Date.now()) - from,
              to,
              focusedMoment: to,
              autoRefresh: false
            };
          }
          return null;
        })
      : null,
    [id, shouldRunInfra]
  );

  // 2. Use createSnapshotObservable with the new time window
  const snapshotData = useObservable(
    shouldRunInfra && newTimeWindow
      ? createSnapshotObservable({
          snapshotId: id,
          timeConfig: newTimeWindow || timeWindow
        })
      : null,
    [id, entityType, newTimeWindow]
  );

  // For endpoint entities
  const endpointData = useObservable(entityType === 'endpoint' && id ? getEndpointInfo({ id }) : null, [
    id,
    entityType
  ]);

  // For service entities
  const serviceData = useObservable(entityType === 'service' && id ? getServiceLabel({ id }) : null, [id, entityType]);

  // For application entities
  const applicationData = useObservable(entityType === 'application' && id ? getApplication({ id }) : null, [
    id,
    entityType
  ]);

  switch (entityType) {
    case 'application':
      return {
        label: applicationData?.data?.label || 'unknown',
        loading: applicationData?.progress.loading || false,
        error: applicationData?.errors
      };
    case 'endpoint':
      return {
        label: endpointData?.data?.label || 'unknown',
        loading: endpointData?.progress.loading || false,
        error: applicationData?.errors
      };
    case 'infrastructure':
    case 'process':
      return {
        label: snapshotData?.label || 'unknown',
        loading: false,
        error: []
      };

    case 'service':
      return {
        label: serviceData?.data?.label || 'unknown',
        loading: serviceData?.progress.loading || false,
        error: serviceData?.errors
      };

    default:
      return {
        label: 'unknown',
        loading: false,
        error: [{ code: 'NOT_FOUND', message: 'entity is not defined' }]
      };
  }
}

export default useGetEntityLabel;
