/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import SloBurnRateChart from 'in-service-levels/components/Shared/SloBurnRateChart';

interface BurnRateChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  configuration: ServiceLevelObjectiveConfiguration;
  title?: string;
}

export default function BurnRateChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  configuration,
  title
}: BurnRateChartProps) {
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();

  return (
    <SloBurnRateChart
      automaticallySize={automaticallySize}
      customHeight={customHeight}
      customChartSkeletonHeight={customChartSkeletonHeight}
      timeConfig={timeConfig}
      timeWindows={timeWindows}
      timeWindowColors={timeWindowColors}
      configuration={configuration}
      title={title}
    />
  );
}
