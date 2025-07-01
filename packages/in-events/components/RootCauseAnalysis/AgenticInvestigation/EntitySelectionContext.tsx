/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { get } from 'lodash';

import determineEntityTypeFromEntityIDMap from 'in-events/components/RootCauseAnalysis/utils/determineEntityTypeFromEntityIDMap';
import { getRootCauses } from 'in-events/components/RootCauseAnalysis/utils/getRootCauses';
import { Event } from 'in-types';

interface EntitySelectionContextType {
  selectedEntityId: string | null;
  setSelectedEntityId: React.Dispatch<React.SetStateAction<string | null>>;
}

const EntitySelectionContext = createContext<EntitySelectionContextType | undefined>(undefined);

interface EntitySelectionProviderProps {
  children: ReactNode;
  incident: Event;
}

const determineEntitySelectionFromIncident = (incident: Event): string => {
  // get first root cause
  const firstRootCause = getRootCauses(incident)[0];

  // extract snapshot id or entity id depending on type of entity
  const entityType = determineEntityTypeFromEntityIDMap(firstRootCause?.entityID);
  const snapshotID =
    entityType === 'infrastructure' || entityType === 'process'
      ? firstRootCause.snapshotId
      : firstRootCause.entityID.steadyId;
  // set that as the initial state in selectedEntityId for topology + side panel
  return snapshotID;
};

export const EntitySelectionProvider: React.FC<EntitySelectionProviderProps> = ({ children, incident }) => {
  const initialId = get(incident, 'metadata.rootCause.found', false)
    ? determineEntitySelectionFromIncident(incident)
    : null;

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(initialId);

  return (
    <EntitySelectionContext.Provider value={{ selectedEntityId, setSelectedEntityId }}>
      {children}
    </EntitySelectionContext.Provider>
  );
};

export const useEntitySelection = (): EntitySelectionContextType => {
  const context = useContext(EntitySelectionContext);
  if (context === undefined) {
    throw new Error('useEntitySelection must be used within an EntitySelectionProvider');
  }
  return context;
};
