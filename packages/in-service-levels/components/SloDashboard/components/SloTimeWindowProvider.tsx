/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, ReactNode, SetStateAction, createContext, useMemo, useState } from 'react';
import _ from 'lodash';

import { TimeConfig, TimeWindow } from '@instana/types';
import { useTheme } from '@instana/components';

import useOverlappingTimeWindows from 'in-service-levels/hooks/useOverlappingTimeWindows';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { SloTimeWindowTypes } from 'in-service-levels/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { hours } from 'in-services/time/time';

const TIME_WINDOW_COLOR_TOKEN_PATHS = [
  'ids.color.option.blue.400',
  'ids.color.option.purple.500',
  'ids.color.option.green.500',
  'ids.color.option.deep-purple.500',
  'ids.color.option.blue.500',
  'ids.color.option.green.800',
  'ids.color.option.teal.400',
  'ids.color.option.indigo.500'
];

type AvailableTimeWindowTypes = keyof typeof SloTimeWindowTypes;

export interface TimeWindowContext {
  timeWindows: TimeConfig[];
  timeWindowColors: string[];
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
  const theme = useTheme();
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
    timeWindowColors: timeWindows?.map((_, index) => getColorByTimeWindowIndex(index, theme)) ?? [],
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
    : // Limit the window-size to a single hour to make sure we only fetch one time-window
      { ...selectedTimeConfig, windowSize: hours.toMillis(1) };
}

function getColorByTimeWindowIndex(index: number, theme: ReturnType<typeof useTheme>): string {
  const tokenPath =
    index < TIME_WINDOW_COLOR_TOKEN_PATHS.length
      ? TIME_WINDOW_COLOR_TOKEN_PATHS[index]
      : TIME_WINDOW_COLOR_TOKEN_PATHS[index % TIME_WINDOW_COLOR_TOKEN_PATHS.length];
  return _.get(theme, tokenPath);
}
