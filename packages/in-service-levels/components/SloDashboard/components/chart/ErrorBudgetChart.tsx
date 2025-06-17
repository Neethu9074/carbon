/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import { getCorrectionWindowMetrics } from 'in-service-levels/components/SloDashboard/components/chart/renderer/utils';
import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import SloErrorBudgetChart from 'in-service-levels/components/Shared/SloErrorBudgetChart';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';

interface ErrorBudgetChartProps {
  automaticallySize?: boolean;
  customHeight?: number;
  customChartSkeletonHeight?: number;
  configuration: ServiceLevelObjectiveConfiguration;
  title?: string;
}

export default function ErrorBudgetChart({
  automaticallySize,
  customHeight,
  customChartSkeletonHeight,
  configuration,
  title
}: ErrorBudgetChartProps) {
  const { timeWindows, timeWindowColors, correctionData } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const correctionWindowMetrics = getCorrectionWindowMetrics(correctionData.data);

  return (
    <SloErrorBudgetChart
      automaticallySize={automaticallySize}
      customHeight={customHeight}
      customChartSkeletonHeight={customChartSkeletonHeight}
      timeConfig={timeConfig}
      timeWindows={timeWindows}
      correctionWindowMetrics={correctionWindowMetrics}
      timeWindowColors={timeWindowColors}
      configuration={configuration}
      title={title}
    />
  );
}
