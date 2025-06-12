/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Set } from 'immutable';
import { useMemo } from 'react';
import { get } from 'lodash';

import { useObservable } from '@instana/hooks';

import {
  ConnectionsMap,
  NodesMap,
  constructConnectionsMap,
  constructNodesMap,
  extractServicesFromStackQuery,
  getFilterForServiceRelationships,
  getServiceToServiceConnections,
  specialCaseConnectionsAndNodes
} from 'in-events/components/legacy/TopologyUtils';
import { RCAEntityDataType } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAppropriateRCAEntityData';
import getServiceMap from 'in-applications/subscriptions/getServiceMap';
import { Application, Event, TimeConfig } from 'in-types';

interface UseRootCauseTopologyDataProps {
  relatedApplicationInformation: Application | null | undefined;
  incident: Event;
  timeConfig: TimeConfig;
  triggeringEntityData: RCAEntityDataType;
  rootcausesmetadata: RCAEntityDataType[];
  selectedRootCause: number;
  showOverview: boolean;
}

interface UseRootCauseTopologyDataResult {
  nodes: NodesMap;
  relationships: ConnectionsMap[];
  loading: boolean;
  error: boolean;
}

/**
 * Hook to extract and process topology data for root cause analysis
 *
 * @param props - Configuration for the topology data
 * @returns Processed nodes and relationships for the RootCauseTopology component
 */
export default function useRootCauseTopologyData({
  relatedApplicationInformation,
  incident,
  timeConfig,
  triggeringEntityData,
  rootcausesmetadata,
  selectedRootCause,
  showOverview
}: UseRootCauseTopologyDataProps): UseRootCauseTopologyDataResult {
  // Extract services from triggering entity
  const triggeringEntityServicesFromStack = useMemo(
    () => extractServicesFromStackQuery(triggeringEntityData),
    [triggeringEntityData]
  );

  // Check if triggering entity data is loading
  const loadingTriggeringEntity = triggeringEntityData.loadingSnapshotData || triggeringEntityData.loadingStackData;

  // Get connections and services in current AP
  const applicationServicesMapQuery = useObservable(
    getServiceMap({
      includeHealthInfo: false,
      filter: getFilterForServiceRelationships(
        relatedApplicationInformation?.id,
        timeConfig,
        triggeringEntityData,
        rootcausesmetadata[0],
        rootcausesmetadata[1],
        rootcausesmetadata[2]
      )
    }).map(data => data),
    [
      get(incident, 'id', ''),
      rootcausesmetadata[0]?.entityData?.id,
      rootcausesmetadata[1]?.entityData?.id,
      rootcausesmetadata[2]?.entityData?.id
    ]
  );

  // Check for error conditions
  const hasError = !triggeringEntityData.entityData && !triggeringEntityData.loadingSnapshotData;

  // Check if data is still loading
  const isLoading =
    !triggeringEntityData.entityData ||
    !triggeringEntityData.entityStackData ||
    triggeringEntityData.loadingStackData ||
    applicationServicesMapQuery?.progress?.loading ||
    triggeringEntityServicesFromStack === undefined ||
    rootcausesmetadata.some(rca => rca.loadingSnapshotData || rca.loadingStackData) ||
    loadingTriggeringEntity;

  // Process the data to get nodes and relationships
  const { nodes, relationships } = useMemo(() => {
    if (isLoading || hasError || !triggeringEntityServicesFromStack) {
      return { nodes: {}, relationships: [] };
    }

    // Root cause data in arrays for purpose of filtering and tabs
    let rootCauseServices: string[] = [];

    rootcausesmetadata.forEach(rc => {
      if (rc) {
        if (rc.nonInfraServiceLabelInformation) {
          rootCauseServices.push(rc.nonInfraServiceLabelInformation.id);
        } else if (rc.infraServiceLabelInformation && rc.infraServiceLabelInformation.length > 0) {
          rootCauseServices.push(...rc.infraServiceLabelInformation.map(i => i.id));
        } else if (rc.entityData) {
          rootCauseServices.push(rc.entityData.id || '');
        } else {
          rootCauseServices.push('UNKNOWN');
        }
      }
    });

    rootCauseServices = Set<string>(rootCauseServices).toArray();

    const applicationServicesMap = applicationServicesMapQuery?.data ?? { connections: [], services: [] };

    const serviceToServiceConnections = getServiceToServiceConnections(
      applicationServicesMap,
      triggeringEntityServicesFromStack,
      rootCauseServices
    );

    const nodesPreSpecialCases = constructNodesMap(
      serviceToServiceConnections,
      rootcausesmetadata,
      triggeringEntityData,
      triggeringEntityServicesFromStack
    );

    const relationshipsPreSpecialCases = constructConnectionsMap(
      serviceToServiceConnections,
      rootcausesmetadata,
      triggeringEntityData,
      triggeringEntityServicesFromStack,
      Object.keys(nodesPreSpecialCases)
    );

    return specialCaseConnectionsAndNodes(
      nodesPreSpecialCases,
      relationshipsPreSpecialCases,
      relatedApplicationInformation ?? { id: 'unknown', label: '', boundaryScope: 'ALL' }
    );
  }, [
    isLoading,
    hasError,
    triggeringEntityServicesFromStack,
    rootcausesmetadata,
    applicationServicesMapQuery?.data,
    triggeringEntityData,
    relatedApplicationInformation
  ]);

  // Apply filtering based on selected root cause or overview
  const filteredNodes = useMemo(() => {
    if (isLoading || hasError) {
      return {};
    }

    if (showOverview) {
      return nodes;
    }

    const selectedRCAIndex = rootcausesmetadata[selectedRootCause];
    const newNodes = { ...nodes };

    if (selectedRCAIndex) {
      const { entityData } = selectedRCAIndex;
      if (entityData) {
        const rcaID = get(entityData, 'id');
        Object.keys(newNodes).forEach(nodeID => {
          if (nodeID !== rcaID && newNodes[nodeID].tags.has('RCA')) {
            newNodes[nodeID].specialCaseVisibility = false;
          } else if (nodeID === rcaID) {
            newNodes[nodeID].specialCaseVisibility = true;
          }
        });
      }
    }

    return newNodes;
  }, [nodes, showOverview, selectedRootCause, rootcausesmetadata, isLoading, hasError]);

  return {
    nodes: filteredNodes,
    relationships,
    loading: isLoading,
    error: hasError
  };
}
