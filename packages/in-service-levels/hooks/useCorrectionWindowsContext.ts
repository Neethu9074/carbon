/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useContext } from 'react';

import type { CorrectionWindowsContext } from 'in-service-levels/components/SloDashboard/components/SloCorrectionWindowsProvider';
import { SloCorrectionWindowsContext } from 'in-service-levels/components/SloDashboard/components/SloCorrectionWindowsProvider';

export default function useCorrectionWindowsContext(): CorrectionWindowsContext {
  const context = useContext(SloCorrectionWindowsContext);

  if (context === undefined) {
    throw new Error('useSloTimeWindowContext must be used within a SloCorrectionWindowProvider');
  }

  return context;
}
