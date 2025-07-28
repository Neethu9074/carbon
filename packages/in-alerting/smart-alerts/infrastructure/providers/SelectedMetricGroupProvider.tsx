/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

import { Tags } from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';

interface SelectedMetricGroupContextType {
  selectedMetricGroup: Tags | null;
  setSelectedMetricGroup: (v: Tags | null) => void;
}

export const SelectedMetricGroupContext = createContext<SelectedMetricGroupContextType | null>(null);

export function useSelectedMetricGroup() {
  const ctx = useContext(SelectedMetricGroupContext);
  if (!ctx) throw new Error('Missing SelectedMetricGroupProvider');
  return ctx;
}

export function SelectedMetricGroupProvider({ children }: { children: ReactNode }) {
  const [selectedMetricGroup, setSelectedMetricGroup] = useState<Tags | null>(null);

  return (
    <SelectedMetricGroupContext.Provider value={{ selectedMetricGroup, setSelectedMetricGroup }}>
      {children}
    </SelectedMetricGroupContext.Provider>
  );
}

export default SelectedMetricGroupProvider;
