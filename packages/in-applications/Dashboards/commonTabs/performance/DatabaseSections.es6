import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import { millis } from 'in-services/formatters/number';
import { compare } from 'in-services/util/number';
import SqlTopList from './SqTopList/SqlTopList';

// eslint-disable-next-line no-unused-vars
export default function DatabaseSections({ applicationId, serviceId, timeframe }) {
  const topListSqlDummyData = [
    {
      key: 'q1',
      label: 'SELECT * FROM DB1.HUMONGOUS_TABLE',
      avgMs: 812,
      times: 347,
      maxMs: 812
    },
    {
      key: 'q2',
      label: 'UPDATE DB1.HUMONGOUS_TABLE SET FOO=$1 WHERE BAR=$2',
      avgMs: 756,
      times: 245,
      maxMs: 812
    },
    {
      key: 'q3',
      label: 'SELECT * FROM schema.whatever',
      avgMs: 682,
      times: 245,
      maxMs: 812
    }
  ];

  return (
    <div>
      <DashboardSection>
        <h2>Database</h2>
        <h3>Reads versus Writes</h3>
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
      <DashboardSection>
        <SqlTopList data={topListSqlDummyData} header="Slow Queries" />
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
