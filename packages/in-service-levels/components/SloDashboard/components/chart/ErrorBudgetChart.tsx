/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import useCorrectionWindowOverlay from 'in-service-levels/hooks/useCorrectionWindowOverlay';
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
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const { onLegendItemToggle, groups, overlappingSections } = useCorrectionWindowOverlay();

  return (
    <SloErrorBudgetChart
      automaticallySize={automaticallySize}
      customHeight={customHeight}
      customChartSkeletonHeight={customChartSkeletonHeight}
      timeConfig={timeConfig}
      timeWindows={timeWindows}
      onLegendItemToggle={onLegendItemToggle}
      groups={groups}
      overlappingSections={overlappingSections}
      timeWindowColors={timeWindowColors}
      configuration={configuration}
      title={title}
    />
  );
}
