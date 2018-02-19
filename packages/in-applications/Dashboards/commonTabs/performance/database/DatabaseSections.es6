import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DatabaseStatementTopList from './DatabaseStatementTopList';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import { millis } from 'in-services/formatters/number';
import { compare } from 'in-services/util/number';

export default function DatabaseSections({ applicationId, serviceId, timeframe }) {
  return (
    <div>
      <h2>Database</h2>
      <DashboardSection title="Reads versus Writes">
        <Chart
          timeframe={timeframe}
          y1={{
            renderer: Renderer.stackedArea,
            labels: ['Reads', 'Writes'],
            colors: ['#00f', '#0f0'],
            formatter: millis,
            metrics: [generateMetrics(timeframe), generateMetrics(timeframe)]
          }}
        />
      </DashboardSection>
      <DashboardSection title="Slow Statements">
        <DatabaseStatementTopList applicationId={applicationId} serviceId={serviceId} timeframe={timeframe} />
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
