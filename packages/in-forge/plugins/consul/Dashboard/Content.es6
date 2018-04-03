import React from 'react';

import Columize from 'in-sdk/components/dashboard/Columize';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart';
import DashboardNotification from 'in-components/DashboardNotification';
import { withSiPrefixZeroDecimalPlaces } from 'in-services/formatters/number';

export default function ConsulDashboard({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');
  const errorCode = snapshot.getIn(['data', 'error_code']);
  const consulVersion = snapshot.getIn(['data', 'consul_version']);

  if (errorCode !== 'NO_ERROR') {
    return (
      <DashboardNotification type="warning">
        <strong>Consul version too old</strong>
        <p>
          The Consul version you are using is too old and does not provide metrics. Please upgrade to version 0.9.1 or
          higher to receive metrics in this dashboard.
        </p>
        <p>
          Current Consul Version: <code>{consulVersion}</code>
        </p>
      </DashboardNotification>
    );
  } else {
    return (
      <div>
        <Columize>
          <DashboardSection title="Allocated Bytes">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              y1={{
                min: 0,
                metrics: ['consul.runtime.alloc_bytes'],
                labels: ['Allocated Bytes'],
                formatter: withSiPrefixZeroDecimalPlaces,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
          <DashboardSection title="Runtime">
            <Chart
              snapshotId={snapshotId}
              timeframe={timeframe}
              y1={{
                min: 0,
                metrics: ['consul.runtime.malloc_count', 'consul.runtime.free_count'],
                labels: ['Malloc Count', 'Free Count'],
                formatter: withSiPrefixZeroDecimalPlaces,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
}
