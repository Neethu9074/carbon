import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces
} from 'in-services/formatters/number';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import NetworkInterfacesTable from 'in-forge/plugins/host/Dashboard/NetworkInterfacesTable';
import AgentManagementButton from 'in-forge/plugins/host/Dashboard/AgentManagementButton';
import FilesystemsTable from 'in-forge/plugins/host/Dashboard/FilesystemsTable';
import CompanionMetrics from 'in-sdk/components/dashboard/CompanionMetrics';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ProcessTopList from 'in-forge/plugins/host/Dashboard/ProcessTopList';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import { isWindows, isZos } from 'in-forge/plugins/host/hostUtils';
import CpuTable from 'in-forge/plugins/host/Dashboard/CpuTable';
import { getHostCompanions } from 'in-stores/snapshot/graph';
import MetricValue from 'in-components/MetricValue';
import { getLabel } from 'in-sdk/snapshot';
import Chart from 'in-components/Chart';

import './Content.less';

const block = 'in-forge-host-dashboard';

export default function HostDashboard({ snapshot, timeframe }) {
  const swapTotal = snapshot.getIn(['data', 'swap.total'], 0);

  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>

        <KpiKeyValue label="CPU Usage">
          <MetricValue snapshotId={snapshot.get('id')} metric="cpu.used" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>

        <KpiKeyValue label="Memory Usage">
          <MetricValue snapshotId={snapshot.get('id')} metric="memory.used" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>

      <TwoColumnRow>
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
              metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal'],
              labels: ['User', 'System', 'Wait', 'Nice', 'Steal'],
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        {!(isWindows(snapshot) || isZos(snapshot))
          ? <DashboardSection title="CPU Load">
              <Chart
                snapshotId={snapshot.get('id')}
                timeframe={timeframe}
                margins={{
                  left: 60
                }}
                y1={{
                  min: 0,
                  type: 'stackedArea',
                  formatter: twoDecimalPlaces,
                  tooltipFormatter: twoDecimalPlaces,
                  metrics: ['load.1min'],
                  labels: ['Load']
                }}
              />
            </DashboardSection>
          : null}
      </TwoColumnRow>

      <CpuTable snapshot={snapshot} timeframe={timeframe} />

      <DashboardSection title="Memory Used">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageZeroDecimalPlaces,
            tooltipFormatter: percentageTwoDecimalPlaces,
            metrics: ['memory.used'],
            labels: ['Used'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      {swapTotal > 0
        ? <DashboardSection title="Swap Activity">
            <Chart
              snapshotId={snapshot.get('id')}
              timeframe={timeframe}
              margins={{
                left: 90
              }}
              y1={{
                min: 0,
                formatter: twoDecimalPlaces,
                metrics: ['swap.pgin', 'swap.pgout'],
                labels: ['Page-In', 'Page-Out'],
                type: 'line'
              }}
            />
          </DashboardSection>
        : null}

      <FilesystemsTable snapshot={snapshot} timeframe={timeframe} />

      <NetworkInterfacesTable snapshot={snapshot} timeframe={timeframe} />

      <DashboardSection title="TCP Activity">
        <Chart
          snapshotId={snapshot.get('id')}
          timeframe={timeframe}
          height={200}
          y1={{
            type: 'line',
            metrics: ['tcp.established', 'tcp.opens', 'tcp.inSegs', 'tcp.outSegs'],
            labels: ['Established', 'Open/s', 'In Segments/s', 'Out Segments/s'],
            formatter: zeroDecimalPlaces,
            tooltipFormatter: twoDecimalPlaces
          }}
          y2={{
            type: 'line',
            metrics: ['tcp.establishedResets', 'tcp.resets', 'tcp.fails', 'tcp.errors', 'tcp.retrans'],
            labels: ['Established Resets', 'Out Resets', 'Fail', 'Error', 'Retransmission'],
            min: 0,
            max: 1,
            formatter: percentageZeroDecimalPlaces
          }}
          margins={{
            right: 60,
            left: 80
          }}
        />
      </DashboardSection>

      {timeframe.to == null ? <ProcessTopList snapshot={snapshot} /> : null}

      <CompanionMetrics companions$={getHostCompanions(snapshot.get('id'))} timeframe={timeframe} />

      <DashboardSection title="Agent Management">
        <div className={`${block}__self-monitoring`}>
          <div className={`${block}__self-monitoring-description`}>
            <p>
              The Instana Agent has management and self monitoring capabilities which assist troubleshooting and provide
              deeper
              insights without the need to log in and review files. This includes inspecting the agent log, running
              sensor versions and more.
            </p>
          </div>

          <div className={`${block}__self-monitoring-controls`}>
            <AgentManagementButton snapshot={snapshot} />
          </div>
        </div>
      </DashboardSection>
    </div>
  );
}
