/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useContext } from 'react';

import {
  SloTimeWindowContext,
  TimeWindowContext
} from 'in-service-levels/components/SloDashboard/components/SloTimeWindowProvider';

export default function useSloTimeWindowContext(): TimeWindowContext {
  const context = useContext(SloTimeWindowContext);

  if (context === undefined) {
    throw new Error('useSloTimeWindowContext must be used within a SloTimeWindowProvider');
  }

  return context;
}
