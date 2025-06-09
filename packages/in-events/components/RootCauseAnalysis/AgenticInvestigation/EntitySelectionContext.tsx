/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface EntitySelectionContextType {
  selectedEntityId: string | null;
  setSelectedEntityId: React.Dispatch<React.SetStateAction<string | null>>;
}

const EntitySelectionContext = createContext<EntitySelectionContextType | undefined>(undefined);

interface EntitySelectionProviderProps {
  children: ReactNode;
}

export const EntitySelectionProvider: React.FC<EntitySelectionProviderProps> = ({ children }) => {
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

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
