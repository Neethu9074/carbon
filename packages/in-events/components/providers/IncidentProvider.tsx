/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';

import { Event } from '@instana/types';

// Create the context with default undefined value
interface IncidentContextType {
  incident: Event;
  setIncident: (incident: Event) => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

interface IncidentProviderProps {
  children: ReactNode;
  incident: Event;
}

/**
 * Provider component that makes incident data available to its children
 */
export const IncidentProvider: React.FC<IncidentProviderProps> = ({ children, incident }) => {
  const [currentIncident, setCurrentIncident] = useState<Event>(incident);

  // Update the incident state when the prop changes
  useEffect(() => {
    setCurrentIncident(incident);
  }, [incident]);

  return (
    <IncidentContext.Provider value={{ incident: currentIncident, setIncident: setCurrentIncident }}>
      {children}
    </IncidentContext.Provider>
  );
};

/**
 * Hook to access the incident context
 */
export const useIncident = (): IncidentContextType => {
  const context = useContext(IncidentContext);
  if (context === undefined) {
    throw new Error('useIncident must be used within an IncidentProvider');
  }
  return context;
};

export default IncidentProvider;
