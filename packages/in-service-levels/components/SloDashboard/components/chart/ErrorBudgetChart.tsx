/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration } from '@instana/types';

import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import SloErrorBudgetChart from 'in-service-levels/components/Shared/SloErrorBudgetChart';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';

interface ErrorBudgetChartProps {
  automaticallySized?: boolean;
  configuration: ServiceLevelObjectiveConfiguration;
  title?: string;
}

export default function ErrorBudgetChart({ automaticallySized, configuration, title }: ErrorBudgetChartProps) {
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();

  return (
    <SloErrorBudgetChart
      automaticallySized={automaticallySized}
      timeConfig={timeConfig}
      timeWindows={timeWindows}
      timeWindowColors={timeWindowColors}
      configuration={configuration}
      title={title}
    />
  );
}
