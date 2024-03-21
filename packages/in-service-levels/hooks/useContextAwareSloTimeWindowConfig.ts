/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import useSloTimeWindowContext from "in-service-levels/hooks/useSloTimeWindowContext";
import { getEntireTimeWindowConfigFromTimeWindows } from "in-service-levels/utils/time";
import { TimeConfig } from "@instana/types";
import useTimeConfig from "in-hooks/useTimeConfig";

export default function useContextAwareSloTimeWindowConfig(): TimeConfig {
  const selectedTimeConfig = useTimeConfig();
  const { timeWindows, selectedTimeWindowType } = useSloTimeWindowContext();

  return selectedTimeWindowType === 'SLO_TIME_WINDOW'
    ? getEntireTimeWindowConfigFromTimeWindows(timeWindows)
    : selectedTimeConfig;
}
