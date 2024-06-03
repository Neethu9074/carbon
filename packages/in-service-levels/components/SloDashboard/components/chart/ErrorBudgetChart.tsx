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
import { t } from 'in-i18n';

interface ErrorBudgetChartProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function ErrorBudgetChart({ configuration }: ErrorBudgetChartProps) {
  const { timeWindows, timeWindowColors } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();

  return (
    <SloErrorBudgetChart
      timeConfig={timeConfig}
      timeWindows={timeWindows}
      timeWindowColors={timeWindowColors}
      configuration={configuration}
      title={t('in-service-levels:sloDashboard.components.errorBudgetChart.title')}
    />
  );
}
