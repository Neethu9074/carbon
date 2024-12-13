/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { createContext, useState } from 'react';
import { Map } from 'immutable';

import { CarbonTab, CarbonTabList, CarbonTabs, LoadingSpinner, Typography } from '@instana/components';
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
import RootCauseTopology from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopology';
import { ProbableCauseType } from 'in-events/components/RootCauseAnalysis/utils/rootCauseUtil';
import RootCauseLegend from 'in-events/components/RootCauseAnalysis/Topology/RootCauseLegend';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import getServiceMap from 'in-applications/subscriptions/getServiceMap';
import { Application, Nullish, TimeConfig } from 'in-types';
import { close } from 'in-components/DialogPresenter/store';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

interface NewRootCauseTopologyDialogProps {
  relatedApplicationInformation: Application | Nullish;
  rootCauses: [string, ProbableCauseType][];
  triggeringEvent: EventOrMap;
  timeConfig: TimeConfig;
}

export const RCATopologyTimeWindowContext = createContext<TimeConfig | null>(null);
export const RCATopologyAPContext = createContext<Application[]>([]);

export default function RootCauseTopologyDialog({
  relatedApplicationInformation,
  rootCauses,
  triggeringEvent,
  timeConfig
}: NewRootCauseTopologyDialogProps) {
  const [selectedTab, setSelectedTab] = useState<number>(0);

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
    addMessage({
      title: t('in-events:RCA.topology.failedToLoadTitle'),
      type: 'danger',
      content: <Typography variant="body-regular">{t('in-events:RCA.topology.failedToLoadDescription')}</Typography>,
      timeout: 10000
    });
    close();
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
    return (
      <DialogWithSlideInView title={t('in-events:RCA.topology.dialogTitle')} onClose={close}>
        <LoadingSpinner description="Loading topology" withOverlay={false} />
      </DialogWithSlideInView>
    );
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
        } else if (rca.entityData && rca.entityType === 'service') {
          if (Map.isMap(rca.entityData)) return rca.entityData.get('id');
          return rca.entityData.id;
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
      Object.keys(nodes).forEach(nodeID => {
        if (nodes[nodeID].tags.has('RCA')) {
          nodes[nodeID].specialCaseVisibility = true;
        }
      });
    }
    const selectedRCAIndex = rootCausesInArray[idx - 1];

    if (selectedRCAIndex) {
      const { entityData, entityType } = selectedRCAIndex;
      if (entityData) {
        const rcaID: string = entityType === 'infrastructure' ? entityData.get('id') : entityData.id;
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

  const getSelectedRCAID = (tabNum: number) => {
    if (tabNum !== 0) {
      const selectedRCAIndex = rootCausesInArray[tabNum - 1];

      if (selectedRCAIndex) {
        const { entityData, entityType } = selectedRCAIndex;
        if (entityData) {
          return entityType === 'infrastructure' ? entityData.get('id') : entityData.id;
        }
      }
    }

    return null;
  };

  return (
    <RCATopologyTimeWindowContext.Provider value={timeConfig}>
      <RCATopologyAPContext.Provider value={relatedApplicationInformation ? [relatedApplicationInformation] : []}>
        <DialogWithSlideInView title={t('in-events:RCA.topology.dialogTitle')} onClose={close}>
          <CarbonTabs
            selectedIndex={selectedTab}
            onChange={val => {
              setSelectedTab(val.selectedIndex);
              rcaFilter(val.selectedIndex);
            }}
          >
            <CarbonTabList aria-label="Topology Selections">
              {tabs.map(({ label }, idx) => {
                if (idx === 0) {
                  return <CarbonTab key={idx}>{label}</CarbonTab>;
                } else if (rootCausesInArray[idx - 1]) {
                  return <CarbonTab key={idx}>{label}</CarbonTab>;
                } else {
                  return undefined;
                }
              })}
            </CarbonTabList>
          </CarbonTabs>
          <RootCauseTopology
            relationships={relationships}
            nodes={rcaFilter(selectedTab)}
            height={'812'}
            width={'1456'}
            selectedRCAID={getSelectedRCAID(selectedTab)}
          />
          <RootCauseLegend />
        </DialogWithSlideInView>
      </RCATopologyAPContext.Provider>
    </RCATopologyTimeWindowContext.Provider>
  );
}

const tabs = [
  {
    label: t('in-events:RCA.topology.overviewTab')
  },
  {
    label: t('in-events:RCA.topology.rootCauseOne')
  },
  {
    label: t('in-events:RCA.topology.rootCauseTwo')
  },
  {
    label: t('in-events:RCA.topology.rootCauseThree')
  }
];
