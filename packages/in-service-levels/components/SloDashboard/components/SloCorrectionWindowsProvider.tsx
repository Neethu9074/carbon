/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { createContext, useState } from 'react';

import type { Correction, CorrectionConfiguration, Progress } from '@instana/types';

import useCorrectionWindowConfigurations from 'in-service-levels/features/CorrectionWindows/hooks/useCorrectionWindowConfigurations';
import useCorrectionWindows from 'in-service-levels/features/CorrectionWindows/hooks/useCorrectionWindows';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { all } from 'in-hooks/utils/progress';

export interface CorrectionWindowsContext {
  correction: Correction | undefined;
  configurations: CorrectionConfiguration[] | undefined;
  progress: Progress;
  selectedConfigurations: CorrectionConfiguration[] | undefined;
  setSelectedConfigurations: (selectedConfigurations: CorrectionConfiguration[] | undefined) => void;
  excludeCorrectionIds: string[] | undefined;
}

interface SloCorrectionWindowsProps {
  children: React.ReactNode;
  sloConfigId?: string;
}

export const SloCorrectionWindowsContext = createContext<CorrectionWindowsContext | undefined>(undefined);

export default function SloCorrectionWindowsProvider({ children, sloConfigId }: SloCorrectionWindowsProps) {
  const newCorrectionWindowsContext = useCorrectionWindowsContext({ sloConfigId });

  return (
    <SloCorrectionWindowsContext.Provider value={newCorrectionWindowsContext}>
      {children}
    </SloCorrectionWindowsContext.Provider>
  );
}

interface UseCorrectionWindowsContextProps {
  sloConfigId?: string;
}

function useCorrectionWindowsContext({ sloConfigId }: UseCorrectionWindowsContextProps) {
  const [selectedConfigurations, setSelectedConfigurations] = useState<CorrectionConfiguration[] | undefined>([]);
  const { timeWindows, selectedTimeWindowType, timeConfig } = useSloTimeWindowContext();
  const [currentTimeWindow] = timeWindows ?? [];
  const correctionTimeConfig = selectedTimeWindowType === 'SLO_TIME_WINDOW' ? currentTimeWindow : timeConfig;
  const configurationsResult = useCorrectionWindowConfigurations({
    sloConfigId
  });
  const excludeCorrectionIds = selectedConfigurations
    ? selectedConfigurations.length === 0
      ? // Empty array means "all selected" - send undefined (no exclusions)
        undefined
      : // Array with items means "only these are selected" - send IDs of unselected ones to exclude
        configurationsResult.data
          ?.filter(config => !selectedConfigurations.some(sc => sc.id === config.id))
          .map(({ id }) => id!)
    : // Undefined means "none selected" - send all IDs to exclude all
      configurationsResult.data?.map(({ id }) => id!);

  const correctionWindowsResult = useCorrectionWindows({
    sloConfigId,
    timeConfig: correctionTimeConfig,
    excludeCorrectionIds
  });

  return {
    correction: correctionWindowsResult.data,
    configurations: configurationsResult.data,
    progress: all(correctionWindowsResult.progress, configurationsResult.progress),
    selectedConfigurations,
    setSelectedConfigurations,
    excludeCorrectionIds
  };
}
