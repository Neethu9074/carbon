import React from 'react';

import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import { millis } from 'in-services/formatters/number';
import { compare } from 'in-services/util/number';
import Card from 'in-new-components/Card';

export default function HttpSections({ timeframe }) {
  return (
    <Card title="Http Status Code Breakdown">
      <Chart
        timeframe={timeframe}
        y1={{
          renderer: Renderer.stackedArea,
          labels: ['1XX', '2XX', '3XX', '4XX', '5XX'],
          colors: ['#3dafe7', '#389dcc', '#5b83de', '#9aa4ff', '#bcdbff'],
          formatter: millis,
          metrics: [
            generateMetrics(timeframe),
            generateMetrics(timeframe),
            generateMetrics(timeframe),
            generateMetrics(timeframe),
            generateMetrics(timeframe)
          ]
        }}
      />
    </Card>
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
