/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { createContext, useState } from 'react';
import { ErrorEmptyState } from '@carbon/ibm-products';
import { get } from 'lodash';

import { CarbonTab, CarbonTabList, CarbonTabs, LoadingSpinner } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  constructConnectionsMap,
  constructNodesMap,
  determineEntityTypeFromEntityIDMap,
  extractServicesFromStackQuery,
  getFilterForServiceRelationships,
  getServiceToServiceConnections,
  specialCaseConnectionsAndNodes
} from 'in-events/components/legacy/TopologyUtils';
import useFetchAppropriateRCAEntityData from 'in-events/components/RootCauseAnalysis/hooks/useFetchAppropriateRCAEntityData';
import getRootCauseTabSecondaryLabel from 'in-events/components/RootCauseAnalysis/utils/getRootCauseTabSecondaryLabel';
import getRootCauseTabLabel from 'in-events/components/RootCauseAnalysis/utils/getRootCauseTabLabel';
import RootCauseTopology from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopology';
import { ProbableCauseType } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import RootCauseLegend from 'in-events/components/RootCauseAnalysis/Topology/RootCauseLegend';
import getServiceMap from 'in-applications/subscriptions/getServiceMap';
import { Application, Nullish, TimeConfig } from 'in-types';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

import locals from 'in-events/components/RootCauseAnalysis/Topology/RootCauseMap.mless';

interface NewRootCauseTopologyDialogProps {
  relatedApplicationInformation: Application | Nullish;
  rootCauses: [string, ProbableCauseType][];
  triggeringEvent: EventOrMap;
  timeConfig: TimeConfig;
  selectedRCA: number;
}

export const RCATopologyTimeWindowContext = createContext<TimeConfig | null>(null);
export const RCATopologyAPContext = createContext<Application[]>([]);

export default function RootCauseTopologyDialog({
  relatedApplicationInformation,
  rootCauses,
  triggeringEvent,
  timeConfig,
  selectedRCA
}: NewRootCauseTopologyDialogProps) {
  const [topologyTabs, setTopologyTabs] = useState(selectedRCA + 1);
  const firstRCAIndex = rootCauses[0];
  const secondRCAIndex = rootCauses[1];
  const thirdRCAIndex = rootCauses[2];

  // 1/3 possible RCAs
  const firstRCAType = firstRCAIndex
    ? determineEntityTypeFromEntityIDMap(firstRCAIndex[1].getIn(['entityID', 'pluginId']) as string).generic
    : '';
  const firstRCAID = firstRCAIndex
    ? determineEntityTypeFromEntityIDMap(firstRCAIndex[1].getIn(['entityID', 'pluginId']) as string).generic ===
      'infrastructure'
      ? firstRCAIndex[0]
      : firstRCAIndex[1].getIn(['entityID', 'steadyId'])
    : '';

  const firstRCAData = useFetchAppropriateRCAEntityData(firstRCAType, firstRCAID, timeConfig);
  const loadingFirstRCA = firstRCAIndex ? firstRCAData.loadingSnapshotData || firstRCAData.loadingStackData : false;

  // 2/3 possible RCAs
  const secondRCAType = secondRCAIndex
    ? determineEntityTypeFromEntityIDMap(secondRCAIndex[1].getIn(['entityID', 'pluginId']) as string).generic
    : '';
  const secondRCAID = secondRCAIndex
    ? determineEntityTypeFromEntityIDMap(secondRCAIndex[1].getIn(['entityID', 'pluginId']) as string).generic ===
      'infrastructure'
      ? secondRCAIndex[0]
      : secondRCAIndex[1].getIn(['entityID', 'steadyId'])
    : '';

  const secondRCAData = useFetchAppropriateRCAEntityData(secondRCAType, secondRCAID, timeConfig);
  const loadingSecondRCA = secondRCAIndex ? secondRCAData.loadingSnapshotData || secondRCAData.loadingStackData : false;

  // 3/3 possbile RCAs
  const thirdRCAType = thirdRCAIndex
    ? determineEntityTypeFromEntityIDMap(thirdRCAIndex[1].getIn(['entityID', 'pluginId']) as string).generic
    : '';
  const thirdRCAID = thirdRCAIndex
    ? determineEntityTypeFromEntityIDMap(thirdRCAIndex[1].getIn(['entityID', 'pluginId']) as string).generic ===
      'infrastructure'
      ? thirdRCAIndex[0]
      : thirdRCAIndex[1].getIn(['entityID', 'steadyId'])
    : '';

  const thirdRCAData = useFetchAppropriateRCAEntityData(thirdRCAType, thirdRCAID, timeConfig);
  const loadingThirdRCA = thirdRCAIndex ? thirdRCAData.loadingSnapshotData || thirdRCAData.loadingStackData : false;

  // Extract Triggering Entity type & Data
  const triggeringEntityType = determineEntityTypeFromEntityIDMap(triggeringEvent.get('plugin') as string);
  const triggeringEntityData = useFetchAppropriateRCAEntityData(
    triggeringEntityType.generic,
    triggeringEvent.get('entityId', '') as string,
    timeConfig
  );
  const triggeringEntityServicesFromStack = extractServicesFromStackQuery(triggeringEntityData);

  // Get connections and services in current AP
  const applicationServicesMapQuery = useObservable(
    getServiceMap({
      includeHealthInfo: false,
      filter: getFilterForServiceRelationships(
        relatedApplicationInformation?.id,
        timeConfig,
        triggeringEntityData,
        firstRCAData,
        secondRCAData,
        thirdRCAData
      )
    }).map(data => data),
    [triggeringEvent.get('id')]
  );

  if (!triggeringEntityData.entityData && !triggeringEntityData.loadingSnapshotData) {
    return (
      <ErrorEmptyState
        className={locals.emptyStateContainer}
        title={t('in-events:RCA.topology.failedToLoadTitle')}
        subtitle={t('in-events:RCA.topology.failedToLoadDescription')}
      />
    );
  }

  if (
    !triggeringEntityData.entityData ||
    !triggeringEntityData.entityStackData ||
    triggeringEntityData.entityStackData.progress?.loading ||
    applicationServicesMapQuery?.progress?.loading ||
    triggeringEntityServicesFromStack === undefined ||
    loadingFirstRCA ||
    loadingSecondRCA ||
    loadingThirdRCA
  ) {
    return <LoadingSpinner description="Loading topology" withOverlay={false} />;
  }

  // Root cause data in arrays for purpose of filtering and tabs
  const rootCausesInArray = [firstRCAData, secondRCAData, thirdRCAData].filter(val => val.entityData);
  const rootCauseServices = new Set(
    rootCausesInArray
      .map(rca => {
        if (rca.nonInfraServiceLabelInformation) {
          return [rca.nonInfraServiceLabelInformation.id];
        } else if (rca.infraServiceLabelInformation.length > 0) {
          return rca.infraServiceLabelInformation.map(val => val.id);
        } else if (rca.entityData) {
          return get(rca, 'entityData.id', ['UNKNOWN']);
        } else {
          return ['UNKNOWN'];
        }
      })
      .flat()
      .filter(val => val)
  );

  const applicationServicesMap = applicationServicesMapQuery?.data ?? { connections: [], services: [] };

  const serviceToServiceConnections = getServiceToServiceConnections(
    applicationServicesMap,
    triggeringEntityServicesFromStack,
    rootCauseServices
  );

  const nodesPreSpecialCases = constructNodesMap(
    serviceToServiceConnections,
    rootCausesInArray,
    triggeringEntityData,
    triggeringEntityServicesFromStack
  );

  const relationshipsPreSpecialCases = constructConnectionsMap(
    serviceToServiceConnections,
    rootCausesInArray,
    triggeringEntityData,
    triggeringEntityServicesFromStack,
    Object.keys(nodesPreSpecialCases)
  );

  const { nodes, relationships } = specialCaseConnectionsAndNodes(
    nodesPreSpecialCases,
    relationshipsPreSpecialCases,
    relatedApplicationInformation ?? { id: 'unknown', label: '', boundaryScope: 'ALL' }
  );

  const rcaFilter = (idx: number) => {
    if (idx === 0) {
      return nodes;
    }

    const selectedRCAIndex = rootCausesInArray[idx];

    if (selectedRCAIndex) {
      const { entityData } = selectedRCAIndex;
      if (entityData) {
        const rcaID = get(entityData, 'id');
        Object.keys(nodes).forEach(nodeID => {
          if (nodeID !== rcaID && nodes[nodeID].tags.has('RCA')) {
            nodes[nodeID].specialCaseVisibility = false;
          } else if (nodeID === rcaID) {
            nodes[nodeID].specialCaseVisibility = true;
          }
        });
      }
    }

    return nodes;
  };

  return (
    <RCATopologyTimeWindowContext.Provider value={timeConfig}>
      <RCATopologyAPContext.Provider value={relatedApplicationInformation ? [relatedApplicationInformation] : []}>
        <CarbonTabs selectedIndex={topologyTabs} onChange={i => setTopologyTabs(i.selectedIndex)}>
          <CarbonTabList aria-label="topology views" contained>
            {/* TODO: Remove hardcoded string */}
            <CarbonTab key={0}>{t('in-events:RCA.topology.overviewTab')}</CarbonTab>
            {rootCauses.map(([rootCauseId, rootCause], idx) => (
              <CarbonTab key={rootCauseId} secondaryLabel={getRootCauseTabSecondaryLabel(rootCause)}>
                {getRootCauseTabLabel(idx)}
              </CarbonTab>
            ))}
          </CarbonTabList>
        </CarbonTabs>
        <RootCauseTopology
          relationships={relationships}
          nodes={rcaFilter(topologyTabs)}
          height={'80vh'}
          width={'100%'}
        />
        <RootCauseLegend />
      </RCATopologyAPContext.Provider>
    </RCATopologyTimeWindowContext.Provider>
  );
}
