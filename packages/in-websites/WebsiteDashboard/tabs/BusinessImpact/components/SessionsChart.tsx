/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Result, TimeConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

// @ts-expect-error needs migration to TS
import WebsiteDashboardsMarkerLanes from 'in-websites/WebsiteDashboard/components/WebsiteDashboardsMarkerLanes';
import getBusinessMetricsForWebsites, {
  BusinessDataQuery
} from 'in-bizops/subscriptions/getBusinessMetricsForWebsites';
// @ts-expect-error needs migration to TS
import { extendMetricConfigurationOnLiveMode } from 'in-websites/metrics';
import { MetricData } from 'in-custom-dashboards/widgets/Chart/types';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import ChartWrapper from 'in-components/Chart/ChartWrapper';
import { chartColors } from 'in-themes/chartColors';
import { t } from 'in-i18n';

interface SessionsChartProps {
  timeConfig: TimeConfig;
  websiteId: string;
}

export default function SessionsChart({ timeConfig, websiteId }: SessionsChartProps) {
  const granularity = getChartGranularity(timeConfig);
  const MarkerLanes = WebsiteDashboardsMarkerLanes({ websiteId });

  const query: BusinessDataQuery = {
    timeConfig,
    dataType: 'EUM',
    metrics: {
      started: {
        // Alias for metric
        metric: 'IBM.Automation.Instana.monthly.revenue.1.0.1', // Name of custom metric
        granularity: 0,
        aggregation: 'MEAN'
      }
    }
  };

  const placeholderResult = useObservable(getBusinessMetricsForWebsites(query), [timeConfig]);
  if (!placeholderResult) return null;

  return (
    <>
      <ChartWrapper
        renderPostChartContent={MarkerLanes}
        result={placeholderResult as unknown as Result<MetricData>}
        title={t('in-websites:websiteDashboard.tabs.businessMonitoring.sessionsChartTitle')}
        granularity={granularity}
        timeConfig={timeConfig}
        y1={{
          colors: [chartColors.strokeColors100[5]],
          renderer: Renderer.stackedBar,
          labels: [t('in-websites:websiteDashboard.tabs.businessMonitoring.sessionsChartStartedLabel')],
          metricIds: ['started'],
          metrics: []
        }}
      />
    </>
  );
}
