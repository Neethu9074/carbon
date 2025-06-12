/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { get } from 'lodash';

import { useObservable } from '@instana/hooks';
import { Event } from '@instana/types';

import useRootCauseTopologyData from 'in-events/components/RootCauseAnalysis/Topology/utils/useRootCauseTopologyData';
import { RCAEntityDataType } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAppropriateRCAEntityData';
import SelectedRootCauseContext from 'in-events/components/RootCauseAnalysis/hooks/SelectedRootCauseContext';
import { RootCauseDataContext } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import getIncidentTimeConfig from 'in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig';
import { ConnectionsMap, NodesMap } from 'in-events/components/legacy/TopologyUtils';
import getApplication from 'in-applications/subscriptions/getApplication';
import { TimeConfig } from 'in-types';

// Define the shape of the RootCauseDataContext
interface RootCauseDataContextType {
  rootCauses: RCAEntityDataType[];
  triggeringData: RCAEntityDataType;
}

// Define the shape of the context data
interface RootCauseTopologyDataContextType {
  nodes: NodesMap;
  relationships: ConnectionsMap[];
  loading: boolean;
  error: boolean;
  timeConfig: TimeConfig | null;
  relatedAPInfo: any | null;
}

// Define the shape of the SelectedRootCauseContext
interface SelectedRootCauseContextType {
  selectedRootCause: number;
  setSelectedRootCause: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context with default values
export const RootCauseTopologyDataContext = createContext<RootCauseTopologyDataContextType>({
  nodes: {},
  relationships: [],
  loading: false,
  error: false,
  timeConfig: null,
  relatedAPInfo: null
});

interface RootCauseTopologyDataProviderProps {
  children: ReactNode;
  incident: Event;
  selectedRootCause?: number;
}

/**
 * Provider component that makes topology data available to any child component
 */
export const RootCauseTopologyDataProvider: React.FC<RootCauseTopologyDataProviderProps> = ({
  children,
  incident,
  selectedRootCause: propSelectedRootCause
}) => {
  // Get root cause data from context
  const rootCauseData = useContext(RootCauseDataContext) as RootCauseDataContextType;
  const rootcausesmetadata = rootCauseData?.rootCauses || [];
  const triggeringData = rootCauseData?.triggeringData;

  // Get time configuration
  const timeConfig = getIncidentTimeConfig(incident);

  // Get application information
  const relatedAPID = get(incident, 'metadata.app20ApplicationId', null);
  const relatedAPInfo = useObservable(
    relatedAPID
      ? getApplication({ id: relatedAPID })
          .map((d: any) => d.data)
          .throttle(250)
      : null,
    [relatedAPID]
  );

  // Get selected root cause from context if not provided
  const selectedRootCauseContext = useContext(SelectedRootCauseContext) as SelectedRootCauseContextType | null;
  const contextSelectedRootCause = selectedRootCauseContext?.selectedRootCause || 0;
  const selectedRootCause = propSelectedRootCause !== undefined ? propSelectedRootCause : contextSelectedRootCause;

  // Always show overview (as per requirements)
  const showOverview = true;

  // Use the hook to get topology data
  const topologyData = useRootCauseTopologyData({
    relatedApplicationInformation: relatedAPInfo,
    incident,
    timeConfig,
    triggeringEntityData: triggeringData || ({} as RCAEntityDataType),
    rootcausesmetadata: rootcausesmetadata || [],
    selectedRootCause,
    showOverview
  });

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      ...topologyData,
      timeConfig,
      relatedAPInfo
    }),
    [topologyData, timeConfig, relatedAPInfo]
  );

  return <RootCauseTopologyDataContext.Provider value={contextValue}>{children}</RootCauseTopologyDataContext.Provider>;
};

/**
 * Custom hook to use the topology data context
 */
export const useRootCauseTopologyDataContext = () => {
  const context = useContext(RootCauseTopologyDataContext);
  if (context === undefined) {
    throw new Error('useRootCauseTopologyDataContext must be used within a RootCauseTopologyDataProvider');
  }
  return context;
};
