import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import AgentManagementButton from 'in-forge/plugins/host/Dashboard/AgentManagementButton';
import NetworkInterfacesTable from 'in-forge/plugins/host/Dashboard/NetworkInterfacesTable';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import FilesystemsTable from 'in-forge/plugins/host/Dashboard/FilesystemsTable';
import CompanionMetrics from 'in-sdk/components/dashboard/CompanionMetrics';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ProcessTopList from 'in-forge/plugins/host/Dashboard/ProcessTopList';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import CpuTable from 'in-forge/plugins/host/Dashboard/CpuTable';
import Chart from 'in-components/Chart'
import { getHostCompanions } from 'in-stores/snapshot/graph';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';

import './Content.less';

const block = 'in-forge-host-dashboard';

export default function HostDashboard({ snapshot, timeframe }) {
  const swapTotal = snapshot.getIn(['data', 'swap.total'], 0);

  return (
    <div>
      <DashboardSection title="CPU Usage">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 60
          }}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageZeroDecimalPlaces,
            metrics: ['cpu.user', 'cpu.steal'],
            labels: ['User', 'Steal'],
            type: 'bar'
          }}
        />
      </DashboardSection>

    </div>
  );
}

function isWindows(snapshot) {
  return !!snapshot.getIn(['data', 'os.name'], '').match(/windows/i);
}
