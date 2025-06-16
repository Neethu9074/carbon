/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactNode, useState } from 'react';

import { Event } from '@instana/types';

import { RootCauseTopologyDataProvider } from 'in-events/components/RootCauseAnalysis/Topology/context/RootCauseTopologyDataContext';
import { EntitySelectionProvider } from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntitySelectionContext';
import SelectedRootCauseContext from 'in-events/components/RootCauseAnalysis/hooks/SelectedRootCauseContext';
import { RootCauseDataProvider } from 'in-events/components/RootCauseAnalysis/hooks/useFetchAllRCAData';
import { EventOrMap } from 'in-events/types';

interface EventListProvidersProps {
  children: ReactNode;
  incident: EventOrMap;
}

/**
 * Combined provider that wraps all providers needed for the EventList component
 * Currently includes:
 * - EntitySelectionProvider: Manages the selected entity ID
 * - SelectedRootCauseContext: Manages the selected root cause index
 * - RootCauseDataProvider: Provides root cause analysis data
 * - RootCauseTopologyDataProvider: Provides topology data for root cause analysis
 */
const EventListProviders: React.FC<EventListProvidersProps> = ({ children, incident }) => {
  // Convert incident to JSON if it's an Immutable Map
  const incidentJSON: Event = incident.toJS ? incident.toJS() : (incident as Event);

  // State for selected root cause
  const [selectedRootCause, setSelectedRootCause] = useState(0);

  return (
    <EntitySelectionProvider>
      <SelectedRootCauseContext.Provider value={{ selectedRootCause, setSelectedRootCause }}>
        <RootCauseDataProvider incident={incidentJSON}>
          <RootCauseTopologyDataProvider incident={incidentJSON} selectedRootCause={selectedRootCause}>
            {children}
          </RootCauseTopologyDataProvider>
        </RootCauseDataProvider>
      </SelectedRootCauseContext.Provider>
    </EntitySelectionProvider>
  );
};

export default EventListProviders;
