/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { createContext, useContext, useState } from 'react';
import { Set } from 'immutable';
import { get } from 'lodash';

import { CarbonTab, CarbonTabList, CarbonTabs, LoadingSpinner } from '@instana/components';
import { ErrorEmptyState } from '@instana/ibm-products';
import { useObservable } from '@instana/hooks';

import {
  constructConnectionsMap,
  constructNodesMap,
  extractServicesFromStackQuery,
  getFilterForServiceRelationships,
  getServiceToServiceConnections,
  specialCaseConnectionsAndNodes
} from 'in-events/components/legacy/TopologyUtils';
import determineEntityTypeFromEntityIDMap from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import useFetchAppropriateRCAEntityData from 'in-events/components/RootCauseAnalysis/hooks/useFetchAppropriateRCAEntityData';
import getRootCauseTabSecondaryLabel from 'in-events/components/RootCauseAnalysis/utils/getRootCauseTabSecondaryLabel';
import SelectedRootCauseContext from 'in-events/components/RootCauseAnalysis/hooks/SelectedRootCauseContext';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import getRootCauseTabLabel from 'in-events/components/RootCauseAnalysis/utils/getRootCauseTabLabel';
import RootCauseTopology from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopology';
import RootCauseLegend from 'in-events/components/RootCauseAnalysis/Topology/RootCauseLegend';
import { RootCause } from 'in-events/components/RootCauseAnalysis/utils/types';
import getServiceMap from 'in-applications/subscriptions/getServiceMap';
import { Application, Event, Nullish, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-events/components/RootCauseAnalysis/Topology/RootCauseMap.mless';

interface NewRootCauseTopologyDialogProps {
  relatedApplicationInformation: Application | Nullish;
  incident: Event;
  timeConfig: TimeConfig;
  rootCauses: RootCause[];
}

export const RCATopologyTimeWindowContext = createContext<TimeConfig | null>(null);
export const RCATopologyAPContext = createContext<Application[]>([]);

export default function RootCauseTopologyDialog({
  relatedApplicationInformation,
  rootCauses,
  incident,
  timeConfig
}: NewRootCauseTopologyDialogProps) {
  const { selectedRootCause, setSelectedRootCause } = useContext(SelectedRootCauseContext);
  const [showOverview, setShowOverview] = useState(false);
  const { rootCauses: rootcausesmetadata } = useContext(RootCauseDataContext);

  const RCAData = rootcausesmetadata[selectedRootCause];

  const loadingRCA = RCAData.loadingSnapshotData || RCAData.loadingStackData || false;

  // Extract Triggering Entity type & Data
  const triggeringEntityType = determineEntityTypeFromEntityIDMap({
    host: '',
    pluginId: get(incident, 'plugin'),
    steadyId: ''
  });
  const triggeringEntityData = useFetchAppropriateRCAEntityData(
    triggeringEntityType,
    incident.entityId || '',
    timeConfig
  );
  const loadingTriggeringEntity = triggeringEntityData.loadingSnapshotData || triggeringEntityData.loadingStackData;

  const triggeringEntityServicesFromStack = extractServicesFromStackQuery(triggeringEntityData);

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
      rootcausesmetadata[0].entityData?.id,
      rootcausesmetadata[1].entityData?.id,
      rootcausesmetadata[2].entityData?.id
    ]
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
    triggeringEntityData.loadingStackData ||
    applicationServicesMapQuery?.progress?.loading ||
    triggeringEntityServicesFromStack === undefined ||
    loadingRCA ||
    loadingTriggeringEntity
  ) {
    return <LoadingSpinner description="Loading topology" withOverlay={false} />;
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

  const { nodes, relationships } = specialCaseConnectionsAndNodes(
    nodesPreSpecialCases,
    relationshipsPreSpecialCases,
    relatedApplicationInformation ?? { id: 'unknown', label: '', boundaryScope: 'ALL' }
  );

  const rcaFilter = (idx: number) => {
    if (showOverview) {
      return nodes;
    }

    const selectedRCAIndex = rootcausesmetadata[idx];
    const newNodes = nodes;
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
  };

  return (
    <RCATopologyTimeWindowContext.Provider value={timeConfig}>
      <RCATopologyAPContext.Provider value={relatedApplicationInformation ? [relatedApplicationInformation] : []}>
        <CarbonTabs
          selectedIndex={showOverview ? 0 : selectedRootCause + 1}
          onChange={i => {
            if (i.selectedIndex === 0) {
              setShowOverview(true);
            } else {
              setSelectedRootCause(i.selectedIndex - 1);
              setShowOverview(false);
            }
          }}
        >
          <CarbonTabList aria-label="topology views" contained>
            <CarbonTab key={0}>{t('in-events:RCA.topology.overviewTab')}</CarbonTab>
            {rootCauses.map((rootCause, idx) => (
              <CarbonTab key={rootCause.snapshotId} secondaryLabel={getRootCauseTabSecondaryLabel(rootCause)}>
                {getRootCauseTabLabel(idx)}
              </CarbonTab>
            ))}
          </CarbonTabList>
        </CarbonTabs>
        <RootCauseTopology
          relationships={relationships}
          nodes={rcaFilter(selectedRootCause)}
          height={'80vh'}
          width={'100%'}
        />
        <RootCauseLegend />
      </RCATopologyAPContext.Provider>
    </RCATopologyTimeWindowContext.Provider>
  );
}
