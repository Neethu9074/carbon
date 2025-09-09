/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { llmMetricsMonitoring } from 'in-gen-ai-observability/navigation/paths';
import ModelsTable from 'in-gen-ai-observability/components/ModelsTable';
//@ts-expect-error
import { getSnapshots } from 'in-stores/snapshot';
import LlmChart from 'in-gen-ai-observability/components/LlmChart';
import KpiValue from 'in-gen-ai-observability/components/KpiValue';
import Columize from 'in-sdk/components/dashboard/Columize';
import useTimeConfig from 'in-hooks/useTimeConfig';

// Token Usage and Cost Charts Section
interface ChartSectionProps {
  timeConfig: TimeConfig;
}

const TokenAndCostCharts = React.memo(({ timeConfig }: ChartSectionProps) => (
  <Columize>
    <LlmChart
      timeConfig={timeConfig}
      renderHistoricDataIndicator
      metricType="tokenUsage"
      urlMatrixParamConfig={{
        path: llmMetricsMonitoring,
        paramTab: 'modelTab',
        paramMetric: 'modelMetric'
      }}
    />
    <LlmChart
      timeConfig={timeConfig}
      renderHistoricDataIndicator
      metricType="cost"
      urlMatrixParamConfig={{
        path: llmMetricsMonitoring,
        paramTab: 'modelTab',
        paramMetric: 'modelMetric'
      }}
    />
  </Columize>
));

// Calls and Latency Charts Section
const CallsAndLatencyCharts = React.memo(({ timeConfig }: ChartSectionProps) => (
  <Columize>
    <LlmChart
      timeConfig={timeConfig}
      renderHistoricDataIndicator
      metricType="calls"
      urlMatrixParamConfig={{
        path: llmMetricsMonitoring,
        paramTab: 'modelTab',
        paramMetric: 'modelMetric'
      }}
    />
    <LlmChart
      timeConfig={timeConfig}
      metricType="latency"
      renderHistoricDataIndicator
      urlMatrixParamConfig={{
        path: llmMetricsMonitoring,
        paramTab: 'latencyTab',
        paramMetric: 'latencyMetric'
      }}
    />
  </Columize>
));

// Models Table Section
const ModelsTableSection = React.memo(() => (
  <Columize>
    <ModelsTable />
  </Columize>
));

interface LlmMetricProps {
  timeConfig?: TimeConfig;
}
export default function LlmMetrics(_props: LlmMetricProps) {
  const timeConfig = useTimeConfig();

  return (
    <LeftRightPadding>
      <KpiValue />
      <TokenAndCostCharts timeConfig={timeConfig} />
      <CallsAndLatencyCharts timeConfig={timeConfig} />
      <ModelsTableSection />
    </LeftRightPadding>
  );
}
