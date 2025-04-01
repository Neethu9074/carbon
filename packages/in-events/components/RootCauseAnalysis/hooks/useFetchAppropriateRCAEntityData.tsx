/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// import { useEffect, useState } from 'react';
import { List } from 'immutable';
import { get, isNull } from 'lodash';

import { Observable, combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  getStackForApplication,
  getStackForEndpoint,
  getStackForInfrastructure,
  getStackForService
} from 'in-components/Stack/subscriptions/getStack';
import { QualifiedRCAEntityTypes } from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import createSnapshotObservable from 'in-events/components/RootCauseAnalysis/utils/modifiedSnapshot';
import { Application, Endpoint, Result, ServiceLabel, Snapshot, Stack, TimeConfig } from 'in-types';
//@ts-expect-error
import { getPhysicalHierarchy, getSnapshotVersions } from 'in-stores/snapshot';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';

export const NoAppropriateRCAEntityData = {
  entityData: null,
  hierarchySnapshots: null,
  entityStackData: null,
  infraServiceLabelInformation: [],
  nonInfraServiceLabelInformation: null,
  loadingStackData: false,
  loadingSnapshotData: false
};

const useFetchRCAInfra = (
  entityType: QualifiedRCAEntityTypes | '',
  id: string,
  timeWindow: TimeConfig
): RCAEntityDataType => {
  const shouldRun = entityType === 'infrastructure' || entityType === 'process';

  // 10:00 -- 10:15   || 10:00 -- 10:30

  // 1. run this to get the new time window
  const newTimeWindow = useObservable<TimeConfig | null, any[]>(
    shouldRun
      ? getSnapshotVersions(id).map((versions: List<string>) => {
          if (List.isList(versions) && versions.size > 0) {
            const versionsJS: { to: number; from: number }[] = versions.toJS();
            const { to, from } = versionsJS[versionsJS.length - 1];
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
    [id, shouldRun]
  );
  // 2. when we get data from 1. run the following 3
  const observableResult = useObservable(
    newTimeWindow && shouldRun
      ? combineLatest([
          createSnapshotObservable({
            snapshotId: id,
            timeConfig: newTimeWindow
          }),
          getStackForInfrastructure({
            id: id,
            timeConfig: newTimeWindow
          }) as Observable<Result<Stack>>,
          getPhysicalHierarchy({
            snapshotId: id,
            timeConfig: newTimeWindow
          }).map(d => d.toJS()) as Observable<string[]>
        ])
      : null,
    [id, newTimeWindow, shouldRun]
  );

  const stack = observableResult?.[1];
  const entity = observableResult?.[0];
  const hierarchySnapshotIds = observableResult?.[2];

  const hierarchySnapshots = useObservable(
    shouldRun && hierarchySnapshotIds && newTimeWindow
      ? combineLatest(
          hierarchySnapshotIds.map(i =>
            createSnapshotObservable({
              snapshotId: i,
              timeConfig: newTimeWindow || timeWindow
            })
          )
        )
      : null,
    [id, newTimeWindow, hierarchySnapshotIds, shouldRun]
  );

  let infraServiceLabelInformation = null;
  if (stack?.data?.application) {
    const serviceAppGroup = stack.data.application.groups.find(item => item.type === 'service' && item.itemCount > 0);
    if (serviceAppGroup?.items) {
      infraServiceLabelInformation = serviceAppGroup.items;
    }
  }

  return {
    entityData: entity || null,
    entityType,
    hierarchySnapshots: hierarchySnapshots,
    entityStackData: stack?.data || null,
    infraServiceLabelInformation,
    nonInfraServiceLabelInformation: null,
    loadingStackData: stack?.progress.loading || false,
    loadingSnapshotData: isNull(entity)
  };
};

const useFetchRCAEndpoint = (
  entityType: QualifiedRCAEntityTypes | '',
  id: string,
  timeWindow: TimeConfig
): RCAEntityDataType => {
  const shouldRun = entityType === 'endpoint';

  const results = useObservable(
    shouldRun
      ? combineLatest([
          getEndpointInfo({ id }),
          getStackForEndpoint({ id, timeConfig: timeWindow }) as Observable<Result<Stack>>
        ])
      : null,
    [id, timeWindow, shouldRun]
  );

  const entity = results?.[0];
  const stack = results?.[1];

  const nonInfraServiceLabelInformation = useObservable(
    shouldRun
      ? () => {
          if (entity?.data?.serviceId) {
            return getServiceLabel({
              id: entity.data.serviceId
            });
          }
          return null;
        }
      : null,
    [entity, shouldRun]
  );

  return {
    entityData: get(entity, 'data', null),
    entityType,
    hierarchySnapshots: null,
    entityStackData: get(stack, 'data', null),
    nonInfraServiceLabelInformation: get(nonInfraServiceLabelInformation, 'data', null),
    loadingStackData: get(stack, 'progress.loading', false),
    loadingSnapshotData: get(entity, 'progress.loading', false),
    infraServiceLabelInformation: []
  };
};

const useFetchRCAService = (
  entityType: QualifiedRCAEntityTypes | '',
  id: string,
  timeWindow: TimeConfig
): RCAEntityDataType => {
  const shouldRun = entityType === 'service';

  const results = useObservable(
    shouldRun
      ? combineLatest([
          getServiceLabel({ id }) as Observable<Result<ServiceLabel>>,
          getStackForService({ id, timeConfig: timeWindow }) as Observable<Result<Stack>>
        ])
      : null,
    [id, timeWindow, shouldRun]
  );

  const entity = results?.[0];
  const stack = results?.[1];

  return {
    entityData: get(entity, 'data', null),
    entityType,
    hierarchySnapshots: null,
    entityStackData: get(stack, 'data', null),
    infraServiceLabelInformation: [],
    nonInfraServiceLabelInformation: null,
    loadingStackData: get(stack, 'progress.loading', false),
    loadingSnapshotData: get(stack, 'progress.loading', false)
  };
};

const useFetchRCASA = (
  entityType: QualifiedRCAEntityTypes | '',
  id: string,
  timeWindow: TimeConfig
): RCAEntityDataType => {
  const shouldRun = entityType === 'application';

  const results = useObservable(
    shouldRun
      ? combineLatest([
          getApplication({ id }) as Observable<Result<Application>>,
          getStackForApplication({ id, timeConfig: timeWindow }) as Observable<Result<Stack>>
        ])
      : null,
    [id, timeWindow, shouldRun]
  );

  const entity = results?.[0];
  const stack = results?.[1];

  return {
    entityData: get(entity, 'data', null),
    entityType,
    hierarchySnapshots: null,
    entityStackData: get(stack, 'data', null),
    infraServiceLabelInformation: [],
    nonInfraServiceLabelInformation: null,
    loadingStackData: get(stack, 'progress.loading', false),
    loadingSnapshotData: get(entity, 'progress.loading', false)
  };
};

function useFetchAppropriateRCAEntityData(
  entityType: QualifiedRCAEntityTypes | '',
  id: string,
  incomingTimeWindow: TimeConfig
): RCAEntityDataType {
  const dataForInfra = useFetchRCAInfra(entityType, id, incomingTimeWindow);
  const dataForEndpoint = useFetchRCAEndpoint(entityType, id, incomingTimeWindow);
  const dataForService = useFetchRCAService(entityType, id, incomingTimeWindow);
  const dataForSA = useFetchRCASA(entityType, id, incomingTimeWindow);

  if (entityType === 'infrastructure' || entityType === 'process') {
    return dataForInfra;
  } else if (entityType === 'endpoint') {
    return dataForEndpoint;
  } else if (entityType === 'service') {
    return dataForService;
  } else if (entityType === 'application') {
    return dataForSA;
  }
  return {
    ...NoAppropriateRCAEntityData,
    entityType
  };
}

export default useFetchAppropriateRCAEntityData;

export interface RCAEntityDataType {
  entityData: Snapshot | Endpoint | ServiceLabel | Application | null;
  entityType: QualifiedRCAEntityTypes | '';
  hierarchySnapshots: Snapshot[] | null | undefined;
  entityStackData: Stack | null;
  infraServiceLabelInformation: ServiceLabel[] | null | undefined;
  nonInfraServiceLabelInformation: ServiceLabel | null;
  loadingStackData: boolean;
  loadingSnapshotData: boolean;
}
