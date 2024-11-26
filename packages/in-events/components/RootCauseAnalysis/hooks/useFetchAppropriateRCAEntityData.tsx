/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect, useState } from 'react';
import { List } from 'immutable';

import { combineLatest, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

//@ts-expect-error
import { SnapshotData, getPhysicalHierarchy, getSnapshot, getSnapshotVersions } from 'in-stores/snapshot';
import { getStackForInfrastructure } from 'in-components/Stack/subscriptions/getStack';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getApplication from 'in-applications/subscriptions/getApplication';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { Endpoint, ServiceLabel, TimeConfig } from 'in-types';

function useFetchAppropriateRCAEntityData(entityType: string, id: string, incomingTimeWindow: TimeConfig) {
  // Generic query observable variable that gets information on a given endpoint/servce/infra/app set by the useEffect below
  const [query, setQuery] = useState<
    Observable<SnapshotData> | Observable<Endpoint | undefined> | Observable<ServiceLabel | undefined> | null
  >(null);

  // Time window variable used for generating links to analyze page and sending query for entity, can be re-set by our infra query
  const [timeWindowForHierarchyQuery, setTimeWindowForHierarchyQuery] = useState(incomingTimeWindow);

  const { location } = useNavigation();

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
              setQuery(getSnapshot(id, timeConfigFromSnapVersion));
              setStackQuery(getStackForInfrastructure({ id: id, timeConfig: timeConfigFromSnapVersion }));
            }
          }
        })
      );
    } else if (entityType === 'endpoint') {
      setQuery(
        getEndpointInfo({ id })
          .map(data => data.data)
          .throttle(250)
      );
    } else if (entityType === 'service') {
      setQuery(
        getServiceLabel({ id })
          .map(data => data.data)
          .throttle(250)
      );
    } else if (entityType === 'application') {
      setQuery(
        getApplication({ id })
          .map(data => data.data)
          .throttle(250)
      );
    }
  }, [id, entityType, location]);

  // Holds the result of our entity observable
  const entityData = useObservable(query, [query]) ?? null;

  // Holds the result of our physical hierarchy query
  const hierarchySnapshots = useObservable(() => {
    if (hierarchyQuery) {
      return hierarchyQuery.flatMap(item =>
        combineLatest(
          item
            .toArray()
            .filter(idToCheck => id !== idToCheck) //filter out selected entity to avoid duplication for hosts
            .map(id => getSnapshot(id, timeWindowForHierarchyQuery))
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
      entityData.serviceId
    ) {
      setServiceQuery(
        getServiceLabel({ id: entityData.serviceId })
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

  return {
    entityData,
    hierarchySnapshots,
    entityStackData,
    location,
    infraServiceLabelInformation,
    nonInfraServiceLabelInformation
  };
}

export default useFetchAppropriateRCAEntityData;
