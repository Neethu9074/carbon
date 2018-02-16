import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import { number } from 'in-services/formatters/number';
import LogMessageTopList from './LogMessageTopList';
import { compare } from 'in-services/util/number';

// eslint-disable-next-line no-unused-vars
export default function LoggingSections({ applicationId, serviceId, timeframe }) {
  return (
    <div>
      <h2>Logging</h2>
      <DashboardSection title="Log Level Breakdown">
        <Chart
          timeframe={timeframe}
          y1={{
            renderer: Renderer.stackedArea,
            labels: ['CRITICAL', 'ERROR', 'WARN'],
            colors: ['#f00', '#f80', '#ee0'],
            formatter: number,
            metrics: [generateMetrics(timeframe), generateMetrics(timeframe), generateMetrics(timeframe)]
          }}
        />
      </DashboardSection>
      <DashboardSection title="Most Frequent Messages">
        <LogMessageTopList applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
      </DashboardSection>
    </div>
  );
}

function generateMetrics(timeframe, maxValue = 100, numMetrics) {
  const metrics = [];
  numMetrics = numMetrics || timeframe.windowSize / 5000;
  for (let i = numMetrics; i >= 0; i--) {
    metrics[i] = [timeframe.to - i * (timeframe.windowSize / numMetrics), ((Math.random() * maxValue * 100) | 0) / 100];
  }
  metrics.sort((a, b) => compare(a[0], b[0]));
  return metrics;
}
