/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode, createContext, useMemo } from 'react';
import _ from 'lodash';

import { Progress, TimeConfig, TimeWindow } from '@instana/types';
import { themes } from '@instana/design-tokens';

import {
  defaultServiceLevelObjectiveUrlParameters,
  setTimeWindowTypeUrlParameter
} from 'in-service-levels/navigation/urlParameters';
import { AvailableTimeWindowTypes, isAvailableTimeWindowType } from 'in-service-levels/types';
import useOverlappingTimeWindows from 'in-service-levels/hooks/useOverlappingTimeWindows';
import { ServiceLevelErrors, SloTimeWindowTypes } from 'in-service-levels/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { Location } from 'in-stores/navigation/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { hours } from 'in-services/time/time';

const TIME_WINDOW_COLOR_TOKEN_PATHS = [
  'default.ids.color.option.blue.400',
  'default.ids.color.option.purple.500',
  'default.ids.color.option.green.500',
  'default.ids.color.option.deep-purple.500',
  'default.ids.color.option.blue.500',
  'default.ids.color.option.green.800',
  'default.ids.color.option.teal.400',
  'default.ids.color.option.indigo.500'
];

export interface TimeWindowContext {
  timeWindows: TimeConfig[];
  timeWindowColors: string[];
  selectedTimeWindowType: AvailableTimeWindowTypes;
  updateSelectedTimeWindowType: (timeWindowType: AvailableTimeWindowTypes) => void;
  progress: Progress;
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

const timeWindowTypeParameter = defaultServiceLevelObjectiveUrlParameters.timeWindowType;

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
  const { location, navigate } = useNavigation();
  const selectedTimeWindowType = getTimeWindowTypeParameter(location);
  const updateSelectedTimeWindowType = (timeWindowType: AvailableTimeWindowTypes) => {
    setTimeWindowTypeUrlParameter(location, timeWindowType);
    navigate(location);
  };

  const timeConfig = useMemo(
    () => getTimeConfigBySelectedType(selectedTimeWindowType, selectedTimeConfig, sloTimeWindow),
    [selectedTimeWindowType, selectedTimeConfig, sloTimeWindow]
  );
  const [timeWindows, , , loading] = useOverlappingTimeWindows({ sloConfigId, timeConfig });
  return useStableObjectInstance({
    selectedTimeWindowType,
    timeWindows: timeWindows ?? [],
    timeWindowColors: timeWindows?.map((_, index) => getColorByTimeWindowIndex(index, themes)) ?? [],
    updateSelectedTimeWindowType,
    progress: loading
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

function getColorByTimeWindowIndex(index: number, theme: object): string {
  const tokenPath =
    index < TIME_WINDOW_COLOR_TOKEN_PATHS.length
      ? TIME_WINDOW_COLOR_TOKEN_PATHS[index]
      : TIME_WINDOW_COLOR_TOKEN_PATHS[index % TIME_WINDOW_COLOR_TOKEN_PATHS.length];
  return _.get(theme, tokenPath);
}

function getTimeWindowTypeParameter(location: Location): AvailableTimeWindowTypes {
  const timeWindowType =
    getMatrixParameter(location, timeWindowTypeParameter.path ?? '', timeWindowTypeParameter.name) ??
    defaultTimeWindowType;
  if (isAvailableTimeWindowType(timeWindowType)) return timeWindowType;

  throw new Error(ServiceLevelErrors.UNSUPPORTED_TIME_WINDOW_TYPE);
}
