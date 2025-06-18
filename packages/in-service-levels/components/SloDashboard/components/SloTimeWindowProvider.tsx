/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode, createContext, useMemo } from 'react';
import _ from 'lodash';

import { Progress, Result, TimeConfig, TimeWindow } from '@instana/types';
import { themes } from '@instana/design-tokens';

import useCorrectionWindows, {
  CorrectionWithConfiguration
} from 'in-service-levels/features/CorrectionWindows/hooks/useCorrectionWindows';
import { AvailableTimeWindowTypes, isAvailableTimeWindowType } from 'in-service-levels/types';
import { setTimeWindowTypeUrlParameter } from 'in-service-levels/navigation/urlParameters';
import useOverlappingTimeWindows from 'in-service-levels/hooks/useOverlappingTimeWindows';
import { ServiceLevelErrors, SloTimeWindowTypes } from 'in-service-levels/constants';
import { Location, ParameterDefinition } from 'in-stores/navigation/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
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
  timeWindowTypeParameterDefinition: ParameterDefinition<string>;
  selectedTimeWindowType: AvailableTimeWindowTypes;
  updateSelectedTimeWindowType: (timeWindowType: AvailableTimeWindowTypes) => void;
  progress: Progress;
  correctionData: Result<CorrectionWithConfiguration>;
}

const defaultTimeWindowType = SloTimeWindowTypes.SELECTED_TIME;

export const SloTimeWindowContext = createContext<TimeWindowContext | undefined>(undefined);

interface SloTimeWindowContextProps {
  children: ReactNode;
  sloConfigId?: string;
  sloTimeWindow?: TimeWindow;
  timeWindowTypeParameterDefinition: ParameterDefinition<string>;
}

export default function SloTimeWindowProvider({
  sloTimeWindow,
  children,
  sloConfigId,
  timeWindowTypeParameterDefinition
}: SloTimeWindowContextProps) {
  const selectedTimeConfig = useTimeConfig();
  const newTimeConfigContext = useSelectedTimeWindowContext({
    selectedTimeConfig,
    sloTimeWindow,
    sloConfigId,
    timeWindowTypeParameterDefinition
  });

  return <SloTimeWindowContext.Provider value={newTimeConfigContext}>{children}</SloTimeWindowContext.Provider>;
}

interface UseSelectedTimeWindowContextProps {
  timeWindowTypeParameterDefinition: ParameterDefinition<string>;
  selectedTimeConfig: TimeConfig;
  sloTimeWindow?: TimeWindow;
  sloConfigId?: string;
}

function useSelectedTimeWindowContext({
  timeWindowTypeParameterDefinition,
  selectedTimeConfig,
  sloTimeWindow,
  sloConfigId
}: UseSelectedTimeWindowContextProps): TimeWindowContext {
  const { location, navigate } = useNavigation();
  const selectedTimeWindowType = getTimeWindowTypeParameter(location, timeWindowTypeParameterDefinition);
  const updateSelectedTimeWindowType = (timeWindowType: AvailableTimeWindowTypes) => {
    setTimeWindowTypeUrlParameter(location, timeWindowType, timeWindowTypeParameterDefinition);
    navigate(location);
  };
  const timeConfig = useMemo(
    () => getTimeConfigBySelectedType(selectedTimeWindowType, selectedTimeConfig, sloTimeWindow),
    [selectedTimeWindowType, selectedTimeConfig, sloTimeWindow]
  );

  const [timeWindows, , , loading] = useOverlappingTimeWindows({ sloConfigId, timeConfig });

  const [currentTimeWindow] = timeWindows ?? [];
  const correctionTimeConfig = selectedTimeWindowType === 'SLO_TIME_WINDOW' ? currentTimeWindow : timeConfig;
  const correctionData = useCorrectionWindows({
    sloConfigId,
    timeConfig: correctionTimeConfig
  });

  return useMemo(() => {
    return {
      selectedTimeWindowType,
      timeWindows: timeWindows ?? [],
      timeWindowColors: timeWindows?.map((_, index) => getColorByTimeWindowIndex(index, themes)) ?? [],
      timeWindowTypeParameterDefinition,
      progress: loading,
      updateSelectedTimeWindowType,
      correctionData
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedTimeWindowType,
    timeWindows,
    themes,
    timeWindowTypeParameterDefinition,
    loading,
    correctionData.progress.loading
  ]);
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

function getTimeWindowTypeParameter(
  location: Location,
  timeWindowTypeParameterDefinition: ParameterDefinition<string>
): AvailableTimeWindowTypes {
  const timeWindowType =
    getMatrixParameter(
      location,
      timeWindowTypeParameterDefinition.path ?? '',
      timeWindowTypeParameterDefinition.name
    ) ?? defaultTimeWindowType;
  if (isAvailableTimeWindowType(timeWindowType)) return timeWindowType;

  throw new Error(ServiceLevelErrors.UNSUPPORTED_TIME_WINDOW_TYPE);
}
