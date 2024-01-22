/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, ReactNode, SetStateAction, createContext, useMemo, useState } from 'react';

import { TimeConfig, TimeWindow } from '@instana/types';

import { calculateTimeConfigForSloTimeWindow } from 'in-service-levels/hooks/useSloWindowTimeConfig';
import useOverlappingTimeWindows from 'in-service-levels/hooks/useOverlappingTimeWindows';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { SloTimeWindowTypes } from 'in-service-levels/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';

type AvailableTimeWindowTypes = keyof typeof SloTimeWindowTypes;

export interface TimeWindowContext {
  timeWindows: TimeConfig[];
  selectedTimeWindowType: AvailableTimeWindowTypes;
  updateSelectedTimeWindowType: Dispatch<SetStateAction<AvailableTimeWindowTypes>>;
}

const defaultTimeWindowType = SloTimeWindowTypes.SELECTED_TIME;

export const SloTimeWindowContext = createContext<TimeWindowContext | undefined>(undefined);

interface SloTimeWindowContextProps {
  children: ReactNode;
  sloConfigId?: string;
  sloTimeWindow?: TimeWindow;
}

export default function SloTimeWindowProvider({ sloTimeWindow, children, sloConfigId }: SloTimeWindowContextProps) {
  const selectedTimeConfig = useTimeConfig();
  const newTimeConfigContext = useSelectedTimeWindowContext({ selectedTimeConfig, sloTimeWindow, sloConfigId });

  return <SloTimeWindowContext.Provider value={newTimeConfigContext}>{children}</SloTimeWindowContext.Provider>;
}

interface UseSelectedTimeWindowContextProps {
  selectedTimeConfig: TimeConfig;
  sloTimeWindow?: TimeWindow;
  sloConfigId?: string;
}

function useSelectedTimeWindowContext({
  selectedTimeConfig,
  sloTimeWindow,
  sloConfigId
}: UseSelectedTimeWindowContextProps): TimeWindowContext {
  const [selectedTimeWindowType, updateSelectedTimeWindowType] =
    useState<AvailableTimeWindowTypes>(defaultTimeWindowType);
  const timeConfig = useMemo(
    () => getTimeConfigBySelectedType(selectedTimeWindowType, selectedTimeConfig, sloTimeWindow),
    [selectedTimeWindowType, selectedTimeConfig, sloTimeWindow]
  );
  const [timeWindows] = useOverlappingTimeWindows({ sloConfigId, timeConfig });

  return useStableObjectInstance({
    selectedTimeWindowType,
    timeWindows: timeWindows ?? [],
    updateSelectedTimeWindowType
  });
}

function getTimeConfigBySelectedType(
  selectedTimeWindowType: AvailableTimeWindowTypes,
  selectedTimeConfig: TimeConfig,
  sloTimeWindow?: TimeWindow
): TimeConfig {
  if (sloTimeWindow === undefined) return selectedTimeConfig;

  return selectedTimeWindowType === SloTimeWindowTypes.SELECTED_TIME
    ? selectedTimeConfig
    : calculateTimeConfigForSloTimeWindow(selectedTimeConfig, sloTimeWindow);
}
