import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import DashboardNotification from 'in-components/DashboardNotification';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import OperationsTable from 'in-forge/plugins/etcd/Dashboard/OperationsTable';
import { zeroDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

export default function EtcdDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return (
      <DashboardNotification type="info">
        {sensorConnectionStatus}
      </DashboardNotification>
    );
  }
  return (
    <div>
      <DashboardSection title="Requests">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['requests_received', 'requests_sent'],
            labels: ['Received', 'Sent'],
            formatter: zeroDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Traffic">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            metrics: ['bytes_per_sec_received', 'bytes_per_sec_sent'],
            labels: ['Received', 'Sent'],
            formatter: bytesZeroDecimalPlaces,
            type: 'line'
          }}
        />
      </DashboardSection>
      <DashboardSection title="Storage">
        <TwoColumnRow>
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              metrics: ['storage.expire_count'],
              labels: ['Expire count'],
              formatter: zeroDecimalPlaces,
              type: 'line'
            }}
          />
          <Chart
            snapshotId={snapshotId}
            timeframe={timeframe}
            margins={{
              left: 80
            }}
            y1={{
              metrics: ['storage.watchers'],
              labels: ['Watchers'],
              formatter: zeroDecimalPlaces,
              type: 'line'
            }}
          />
        </TwoColumnRow>

        <OperationsTable snapshot={snapshot} timeframe={timeframe} />
      </DashboardSection>
    </div>
  );
}
