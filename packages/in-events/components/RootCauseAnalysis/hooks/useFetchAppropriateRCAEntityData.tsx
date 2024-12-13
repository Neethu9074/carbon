/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect, useState } from 'react';
import { List, Map } from 'immutable';

import { combineLatest, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  getStackForApplication,
  getStackForEndpoint,
  getStackForInfrastructure,
  getStackForService
} from 'in-components/Stack/subscriptions/getStack';
//@ts-expect-error
import { SnapshotData, getPhysicalHierarchy, getSnapshotVersions } from 'in-stores/snapshot';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import createSnapshotObservable from 'in-subscription/snapshot';
import { Endpoint, ServiceLabel, TimeConfig } from 'in-types';

function useFetchAppropriateRCAEntityData(
  entityType: string,
  id: string,
  incomingTimeWindow: TimeConfig
): RCAEntityDataType {
  // Generic query observable variable that gets information on a given endpoint/servce/infra/app set by the useEffect below
  const [query, setQuery] = useState<
    Observable<SnapshotData> | Observable<Endpoint | undefined> | Observable<ServiceLabel | undefined> | null
  >(null);

  const [loadingSnapshotData, setLoadingSnapshotData] = useState(true);
  const [loadingStackData, setLoadingStackData] = useState(true);

  // Time window variable used for generating links to analyze page and sending query for entity, can be re-set by our infra query
  const [timeWindowForHierarchyQuery, setTimeWindowForHierarchyQuery] = useState(incomingTimeWindow);

  // Service query observable variable that gets service label information that a given entity belongs to
  const [serviceQuery, setServiceQuery] = useState<Observable<ServiceLabel | undefined> | null>(null);

  const [infraServiceLabelInformation, setInfraServiceLabelInfromation] = useState<ServiceLabel[]>([]);

  // Holds the result of our service label observable
  const nonInfraServiceLabelInformation = useObservable(serviceQuery, [serviceQuery]) ?? null;

  // Used only for infra entities to set physical hierarchy query
  const [hierarchyQuery, setHierarchyQuery] = useState<Observable<List<string>> | null>(null);

  // Used to make a app stack query for infrastructure entities
  const [stackQuery, setStackQuery] = useState<Observable<any> | null>(null);

  // This useEffect sets the entity query state variables + necessary infrastructure query variables
  useEffect(() => {
    if (entityType === 'infrastructure' || entityType === 'process') {
      // Need to get snapshot versions first and then retrieve appropriate snapshot
      setQuery(
        getSnapshotVersions(id).map((versions: List<string>) => {
          if (List.isList(versions)) {
            const snapVersions = versions.toJS();
            if (snapVersions.length > 0) {
              const { to, from } = snapVersions[snapVersions.length - 1];

              const timeConfigFromSnapVersion = {
                windowSize: (to || Date.now()) - from,
                to,
                focusedMoment: to
              } as TimeConfig;
              setTimeWindowForHierarchyQuery(timeConfigFromSnapVersion);
              setHierarchyQuery(getPhysicalHierarchy({ snapshotId: id, timeConfig: timeConfigFromSnapVersion }));
              setQuery(
                createSnapshotObservable({
                  snapshotId: id,
                  timeConfig: timeConfigFromSnapVersion
                }) as Observable<SnapshotData>
              );
              setStackQuery(getStackForInfrastructure({ id: id, timeConfig: timeConfigFromSnapVersion }));
            } else {
              setLoadingSnapshotData(false);
              setLoadingStackData(false);
            }
          }
        })
      );
    } else if (entityType === 'endpoint') {
      setQuery(
        getEndpointInfo({ id })
          .map(data => data)
          .throttle(250)
      );
      setStackQuery(getStackForEndpoint({ id: id, timeConfig: incomingTimeWindow })); // FYI: no infra data
    } else if (entityType === 'service') {
      setQuery(
        getServiceLabel({ id })
          .map(data => data)
          .throttle(250)
      );
      setStackQuery(getStackForService({ id: id, timeConfig: incomingTimeWindow }));
    } else if (entityType === 'application') {
      setQuery(
        getApplication({ id })
          .map(data => data)
          .throttle(250)
      );
      setStackQuery(getStackForApplication({ id: id, timeConfig: incomingTimeWindow }));
    }
    setLoadingStackData(true);
    setLoadingSnapshotData(true);
  }, [id, entityType, incomingTimeWindow]);

  // Holds the result of our entity observable
  const entityData = useObservable(query, [query]) ?? null;

  // Holds the result of our physical hierarchy query
  const hierarchySnapshots = useObservable(() => {
    if (hierarchyQuery) {
      return hierarchyQuery.flatMap(item =>
        combineLatest(
          item
            .toArray()
            //            .filter(idToCheck => id !== idToCheck) //filter out selected entity to avoid duplication for hosts
            .map(
              id =>
                createSnapshotObservable({
                  snapshotId: id,
                  timeConfig: timeWindowForHierarchyQuery
                }) as Observable<SnapshotData>
            )
        )
      );
    } else {
      return null;
    }
  }, [timeWindowForHierarchyQuery, hierarchyQuery]);

  // Holds the result of our infra entity stack query
  const entityStackData = useObservable(stackQuery, [stackQuery]) ?? null;

  // This useEffect will set the service label query variable
  useEffect(() => {
    if (
      !serviceQuery &&
      entityType !== 'infrastructure' &&
      entityType !== 'process' &&
      entityData &&
      entityData.data &&
      entityData.data.serviceId
    ) {
      setServiceQuery(
        getServiceLabel({ id: entityData.data.serviceId })
          .map(data => data.data)
          .throttle(250)
      );
    } else if (
      !serviceQuery &&
      (entityType === 'infrastructure' || entityType === 'process') &&
      entityStackData &&
      !entityStackData.progress.loading &&
      entityStackData.data
    ) {
      entityStackData.data.application.groups.map((appStackItem: any) => {
        if (appStackItem.type === 'service' && appStackItem.itemCount >= 1) {
          setInfraServiceLabelInfromation(appStackItem.items);
        }
      });
    }
  }, [entityData, id, serviceQuery, entityType, entityStackData]);

  useEffect(() => {
    if ((entityData && entityData.progress && !entityData.progress.loading) || Map.isMap(entityData))
      setLoadingSnapshotData(false);
  }, [entityData]);

  useEffect(() => {
    if (entityStackData && entityStackData.progress && !entityStackData.progress.loading) setLoadingStackData(false);
  }, [entityStackData]);

  return {
    entityData: Map.isMap(entityData)
      ? entityData
      : entityData?.progress?.loading
      ? null
      : entityData?.data
      ? entityData.data
      : null,
    entityType,
    hierarchySnapshots,
    entityStackData,
    infraServiceLabelInformation,
    nonInfraServiceLabelInformation,
    loadingStackData,
    loadingSnapshotData
  };
}

export default useFetchAppropriateRCAEntityData;

export interface RCAEntityDataType {
  entityData: SnapshotData | null;
  entityType: string;
  hierarchySnapshots: SnapshotData[] | null | undefined;
  entityStackData: any;
  infraServiceLabelInformation: ServiceLabel[];
  nonInfraServiceLabelInformation: ServiceLabel | null;
  loadingStackData: boolean;
  loadingSnapshotData: boolean;
}
