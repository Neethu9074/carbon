/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TimeConfig } from '@instana/types';

import { getEntireTimeWindowConfigFromTimeWindows } from 'in-service-levels/utils/time';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import useStableObjectInstance from 'in-hooks/useStableObjectInstance';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { useRef } from 'react';

export default function useContextAwareSloTimeWindowConfig(): TimeConfig {
  const selectedTimeConfig = useStableTimeConfig();
  const { timeWindows, selectedTimeWindowType } = useSloTimeWindowContext();

  return selectedTimeWindowType === 'SLO_TIME_WINDOW'
    ? getEntireTimeWindowConfigFromTimeWindows(timeWindows)
    : selectedTimeConfig;
}

function useStableTimeConfig(): TimeConfig {
  const nowRef = useRef(Date.now());
  const timeConfig = useTimeConfig();

  if (timeConfig.autoRefresh) nowRef.current = Date.now();

  const customMoment = !timeConfig.autoRefresh && !timeConfig.to && !timeConfig.focusedMoment;
  const to = customMoment ? nowRef.current : timeConfig.to;
  const focusedMoment = customMoment ? to : timeConfig.focusedMoment;

  return useStableObjectInstance({
    ...timeConfig,
    focusedMoment,
    to
  });
}
