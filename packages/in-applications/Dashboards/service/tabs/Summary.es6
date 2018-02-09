import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Columize from 'in-sdk/components/dashboard/Columize';
import Chart from 'in-components/Chart/ChartReactComponent';
import { millis } from 'in-services/formatters/number';
import { compare } from 'in-services/util/number';

export default function Summary({ timeframe }) {
  return (
    <MaxWidthFullscreenContainer>
      <Columize>
        <DashboardSection title="Some Chart">
          <Chart
            timeframe={timeframe}
            y1={{
              renderer: Renderer.countErrorBar,
              labels: ['Calls', 'Errors'],
              metrics: [generateMetrics(timeframe, 100, 20), generateMetrics(timeframe, 0.5, 20)],
              aggregation: 'sum'
            }}
            y2={{
              renderer: Renderer.line,
              labels: ['Latency'],
              colors: ['#57a7f0'],
              formatter: millis,
              metrics: [generateMetrics(timeframe, 2000)]
            }}
          />
        </DashboardSection>
        <DashboardSection title="Technology Breakdown">
          <Chart
            timeframe={timeframe}
            y1={{
              renderer: Renderer.stackedArea,
              labels: ['Self', 'Http', 'RPC'],
              colors: ['#57a7f0', '#6a8bdf', '#b9b3ff'],
              formatter: millis,
              metrics: [generateMetrics(timeframe), generateMetrics(timeframe), generateMetrics(timeframe)]
            }}
          />
        </DashboardSection>
      </Columize>
    </MaxWidthFullscreenContainer>
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
