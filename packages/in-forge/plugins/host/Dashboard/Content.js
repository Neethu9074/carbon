/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  number,
  siPrefix,
  bytes
} from 'in-services/formatters/number';
import { isWindows, isZos, isLinux, supportsOpenFiles } from 'in-forge/plugins/host/hostUtils';
import NetworkInterfacesTable from 'in-forge/plugins/host/Dashboard/NetworkInterfacesTable';
import AgentManagementButton from 'in-forge/plugins/host/Dashboard/AgentManagementButton';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import FilesystemsTable from 'in-forge/plugins/host/Dashboard/FilesystemsTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import CompanionMetrics from 'in-sdk/components/dashboard/CompanionMetrics';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ProcessTopList from 'in-forge/plugins/host/Dashboard/ProcessTopList';
import GpuProcessList from 'in-forge/plugins/host/Dashboard/GpuProcessList';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import CpuTable from 'in-forge/plugins/host/Dashboard/CpuTable';
import GpuTable from 'in-forge/plugins/host/Dashboard/GpuTable';
import { getHostCompanions } from 'in-stores/snapshot/graph';
import Columize from 'in-sdk/components/dashboard/Columize';
import MetricValue from 'in-components/MetricValue';
import Footer from 'in-new-components/Footer';
import { role } from 'in-stores/user';

import locals from './Content.mless';

export default function HostDashboard({ snapshot, timeConfig }) {
  const gpuInfoAvailable = snapshot.getIn(['data', 'gpu.count']);

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="CPU Usage">
          <MetricValue snapshotId={snapshot.get('id')} metric="cpu.used" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>

        <KpiKeyValue label="Memory Usage">
          <MetricValue snapshotId={snapshot.get('id')} metric="memory.used" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>

        {!(isWindows(snapshot) || isZos(snapshot)) && (
          <KpiKeyValue label="CPU Load">
            <MetricValue snapshotId={snapshot.get('id')} metric="load.1min" formatter={twoDecimalPlaces} />
          </KpiKeyValue>
        )}
      </KpiSection>

      <Columize>
        <DashboardSection title="CPU Usage">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              max: 1,
              formatter: percentageZeroDecimalPlaces,
              metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal'],
              labels: ['User', 'System', 'Wait', 'Nice', 'Steal'],
              type: 'stackedArea'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        {isLinux(snapshot) && (
          <DashboardSection title="Context Switches">
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                formatter: number.compact,
                metrics: ['ctxt'],
                labels: ['Context Switches'],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}

        {!(isWindows(snapshot) || isZos(snapshot)) && (
          <DashboardSection title="CPU Load">
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: twoDecimalPlaces,
                tooltipFormatter: twoDecimalPlaces,
                metrics: ['load.1min'],
                labels: ['Load'],
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>

      <CpuTable snapshot={snapshot} timeConfig={timeConfig} />

      {gpuInfoAvailable && <GpuTable snapshot={snapshot} timeConfig={timeConfig} />}
      {gpuInfoAvailable && <GpuProcessList snapshot={snapshot} timeConfig={timeConfig} />}

      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: 1,
            formatter: percentageZeroDecimalPlaces,
            tooltipFormatter: percentageTwoDecimalPlaces,
            metrics: ['memory.used'],
            labels: ['Used'],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        {isLinux(snapshot) && (
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytes.detailed,
              metrics: ['memory.buffers', 'memory.cached', 'memory.available'],
              labels: ['Buffers', 'Cached', 'Available'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        )}
        {isLinux(snapshot) && (
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytes.detailed,
              metrics: ['memory.swapTotal', 'memory.swapFree'],
              labels: ['Swap total', 'Swap free'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        )}
      </DashboardSection>

      {supportsOpenFiles(snapshot) && (
        <DashboardSection title="Open Files">
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: siPrefix.compact,
              tooltipFormatter: number.compact,
              metrics: ['openFiles.current'],
              labels: ['Current'],
              type: 'line'
            }}
            y2={{
              min: 0,
              max: 1,
              formatter: percentageTwoDecimalPlaces,
              tooltipFormatter: percentageTwoDecimalPlaces,
              metrics: ['openFiles.used'],
              labels: ['Used'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <FilesystemsTable snapshot={snapshot} timeConfig={timeConfig} />

      <NetworkInterfacesTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title="TCP Activity">
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
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
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <ProcessTopList snapshot={snapshot} />

      <CompanionMetrics companions$={getHostCompanions(snapshot.get('id'))} timeConfig={timeConfig} />

      {role.canConfigureAgents && (
        <DashboardSection title="Agent Management">
          <div className={locals.agentManagementContent}>
            <div className={locals.agentManagementDescription}>
              <p>
                The Instana Agent has management and self monitoring capabilities which assist troubleshooting and
                provide deeper insights without the need to log in and review files. This includes inspecting the agent
                log, running sensor versions and more.
              </p>
            </div>

            <div>
              <AgentManagementButton snapshot={snapshot} />
            </div>
          </div>
        </DashboardSection>
      )}
      <Footer smallMargin />
    </div>
  );
}
