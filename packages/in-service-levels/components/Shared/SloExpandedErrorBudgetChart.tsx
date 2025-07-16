/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration, TimeConfig } from '@instana/types';

import useOverlappingTimeWindows from 'in-service-levels/hooks/useOverlappingTimeWindows';
import SloErrorBudgetChart from 'in-service-levels/components/Shared/SloErrorBudgetChart';
import { getEntireTimeWindowConfigFromTimeWindows } from 'in-service-levels/utils/time';

interface SloExpandedErrorBudgetChartProps {
  sloConfig: ServiceLevelObjectiveConfiguration;
  timeConfig: TimeConfig;
  title?: string;
}

export default function SloExpandedErrorBudgetChart({
  sloConfig,
  timeConfig,
  title
}: SloExpandedErrorBudgetChartProps) {
  const [timeWindows] = useOverlappingTimeWindows({ sloConfigId: sloConfig?.id, timeConfig });

  if (!timeWindows) return <></>;

  return (
    <SloErrorBudgetChart
      title={title}
      hideCorrectionWindowsLane
      timeConfig={getEntireTimeWindowConfigFromTimeWindows(timeWindows)}
      timeWindows={timeWindows}
      timeWindowColors={['default.ids.color.option.blue.400']}
      configuration={sloConfig}
    />
  );
}
