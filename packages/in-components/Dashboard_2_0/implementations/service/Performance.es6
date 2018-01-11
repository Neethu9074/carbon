import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import HttpFilterSelect from 'in-components/HttpFilterSelect';
import { number } from 'in-services/formatters/number';
import locals from './Performance.mless';
import Table from 'in-components/Table';
import Chart from 'in-components/Chart';

export default function Performance({ snapshot, timeframe }) {
  // dummy data
  snapshot = snapshot || {
    id: 'dummy-snapshot-id',
    get: () => 'dummy-snapshot-id'
  };

  const snapshotId = snapshot.get('id');

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
          snapshotId={snapshotId}
          timeframe={timeframe}
          y1={{
            min: 0,
            metrics: ['dummy.whatever'],
            labels: ['Calls', 'Latency', 'Errors'],
            formatter: number.detailed,
            type: 'line'
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
