import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import HttpFilterSelect from 'in-components/HttpFilterSelect';
import Renderer from 'in-components/Chart/renderer/Renderer';
import Chart from 'in-components/Chart/ChartReactComponent';
import { millis } from 'in-services/formatters/number';
import { compare } from 'in-services/util/number';
import locals from './Performance.mless';
import Table from 'in-components/Table';

export default function Performance({ timeframe }) {
  // dummy data
  const dummyTableRows = [1, 2, 3, 4, 5, 6].map(i => ({
    key: String(i),
    verb: 'GET',
    url: '/article/id',
    service: 'Shop'
  }));

  const tableColumns = [
    {
      title: 'Method',
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.verb + row.url;
        }
      }
    },
    {
      title: 'Service',
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.service;
        }
      }
    },
    {
      title: 'Calls',
      type: 'string',
      typeArgs: {
        getValue() {
          return 'TODO';
        }
      }
    },
    {
      title: 'Latency',
      type: 'string',
      typeArgs: {
        getValue() {
          return 'TODO';
        }
      }
    },
    {
      title: 'Errors',
      type: 'health',
      typeArgs: {
        getSnapshotId(row) {
          return row.key;
        }
      }
    },
    {
      title: 'Incidents',
      type: 'string',
      typeArgs: {
        getValue() {
          return '';
        }
      }
    }
  ];

  return (
    <MaxWidthFullscreenContainer>
      <DashboardSection>
        <h2>Http Status Code Breakdown</h2>
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
      <DashboardSection>
        <div className={locals.inlineHeaderWrapper}>
          <h2 className={locals.inlineHeader}>Http Endpoints</h2>
          <HttpFilterSelect />
        </div>
        <Table cols={tableColumns} rows={dummyTableRows} />
      </DashboardSection>
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
