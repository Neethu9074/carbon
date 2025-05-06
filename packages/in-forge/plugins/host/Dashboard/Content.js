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
import { isWindows, isZos, isLinux, supportsOpenFiles, isAixOs, isIbmiOs } from 'in-forge/plugins/host/hostUtils';
import NetworkInterfacesTable from 'in-forge/plugins/host/Dashboard/NetworkInterfacesTable';
import AgentManagementButton from 'in-forge/plugins/host/Dashboard/AgentManagementButton';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import FilesystemsTable from 'in-forge/plugins/host/Dashboard/FilesystemsTable';
import WinServicesTable from 'in-forge/plugins/host/Dashboard/WinServicesTable';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import CompanionMetrics from 'in-sdk/components/dashboard/CompanionMetrics';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ProcessTopList from 'in-forge/plugins/host/Dashboard/ProcessTopList';
import GpuProcessList from 'in-forge/plugins/host/Dashboard/GpuProcessList';
import PhysicalVolume from 'in-forge/plugins/host/Dashboard/PhysicalVolume';
import VolumeGroups from 'in-forge/plugins/host/Dashboard/VolumeGroups';
import DiskTable from 'in-forge/plugins/host/Dashboard/DiskTable';
import CpuTable from 'in-forge/plugins/host/Dashboard/CpuTable';
import GpuTable from 'in-forge/plugins/host/Dashboard/GpuTable';
import { getHostCompanions } from 'in-stores/snapshot/graph';
import Columize from 'in-sdk/components/dashboard/Columize';
import Disks from 'in-forge/plugins/host/Dashboard/Disks';
import MetricValue from 'in-components/MetricValue';
import Footer from 'in-components/Footer';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Content.mless';

export default function HostDashboard({ snapshot, timeConfig }) {
  const gpuInfoAvailable = snapshot.getIn(['data', 'gpu.count']);

  var memoryUsedMetrics = ['memory.used'];
  var memoryUsedMetricsLabels = [t('in-forge:plugins.host.dashboard.used')];
  if (isAixOs(snapshot)) {
    memoryUsedMetrics = ['memory.used', 'memory.compUsed', 'memory.nonCompUsed'];
    memoryUsedMetricsLabels = [
      t('in-forge:plugins.host.dashboard.used'),
      t('in-forge:plugins.host.dashboard.computational'),
      t('in-forge:plugins.host.dashboard.nonComputational')
    ];
  }

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.host.dashboard.cpuUsage')}>
          <MetricValue snapshotId={snapshot.get('id')} metric="cpu.used" formatter={percentageZeroDecimalPlaces} />
        </KpiKeyValue>

        {isLinux(snapshot) && (
          <>
            <KpiKeyValue label={t('in-forge:plugins.host.dashboard.processBlockedState')}>
              <MetricValue snapshotId={snapshot.get('id')} metric="systemProcess.blockedProcesses" formatter={number.compact} />
            </KpiKeyValue>
            <KpiKeyValue label={t('in-forge:plugins.host.dashboard.processWaitingRuntime')}>
              <MetricValue snapshotId={snapshot.get('id')} metric="systemProcess.runningProcesses" formatter={number.compact} />
            </KpiKeyValue>
          </>
        )}

        {!isIbmiOs(snapshot) && (
          <KpiKeyValue label={t('in-forge:plugins.host.dashboard.memoryUsage')}>
            <MetricValue snapshotId={snapshot.get('id')} metric="memory.used" formatter={percentageZeroDecimalPlaces} />
          </KpiKeyValue>
        )}

        {isAixOs(snapshot) && (
          <KpiKeyValue label={t('in-forge:plugins.host.dashboard.systemCalls')}>
            <MetricValue snapshotId={snapshot.get('id')} metric="cpu.systemCalls" formatter={number.compact} />
          </KpiKeyValue>
        )}

        {isAixOs(snapshot) && (
          <KpiKeyValue label={t('in-forge:plugins.host.dashboard.avgRunQueue')}>
            <MetricValue
              snapshotId={snapshot.get('id')}
              metric="cpu.avgRunQueue"
              formatter={value =>
                value < 0 ? t('in-forge:plugins.host.dashboard.notCollected') : twoDecimalPlaces(value)
              }
            />
          </KpiKeyValue>
        )}

        {!(isWindows(snapshot) || isZos(snapshot)) && (
          <KpiKeyValue label={t('in-forge:plugins.host.dashboard.cpuLoad')}>
            <MetricValue snapshotId={snapshot.get('id')} metric="load.1min" formatter={twoDecimalPlaces} />
          </KpiKeyValue>
        )}
      </KpiSection>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.host.dashboard.cpuUsage')}>
          {isAixOs(snapshot) && (
            <Chart
              snapshotId={snapshot.get('id')}
              snapshotHostFqdn={snapshot.getIn(['data', 'fqdn'])}
              hasActionlane
              timeConfig={timeConfig}
              y1={{
                min: 0,
                max: 1,
                formatter: percentageZeroDecimalPlaces,
                metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.hypv', 'cpu.used', 'cpu.idle'],
                labels: [
                  t('in-forge:plugins.host.dashboard.user'),
                  t('in-forge:plugins.host.dashboard.system'),
                  t('in-forge:plugins.host.dashboard.wait'),
                  t('in-forge:plugins.host.dashboard.hypv'),
                  t('in-forge:plugins.host.dashboard.used'),
                  t('in-forge:plugins.host.dashboard.idle')
                ],
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          )}

          {isIbmiOs(snapshot) && (
            <Chart
              snapshotId={snapshot.get('id')}
              snapshotHostFqdn={snapshot.getIn(['data', 'fqdn'])}
              hasActionlane
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: percentageZeroDecimalPlaces,
                metrics: ['cpu.user'],
                labels: [t('in-forge:plugins.host.dashboard.user')],
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          )}

          {!isAixOs(snapshot) && !isIbmiOs(snapshot) && (
            <Chart
              snapshotId={snapshot.get('id')}
              snapshotHostFqdn={snapshot.getIn(['data', 'fqdn'])}
              hasActionlane
              timeConfig={timeConfig}
              y1={{
                min: 0,
                max: 1,
                formatter: percentageZeroDecimalPlaces,
                metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal'],
                labels: [
                  t('in-forge:plugins.host.dashboard.user'),
                  t('in-forge:plugins.host.dashboard.system'),
                  t('in-forge:plugins.host.dashboard.wait'),
                  t('in-forge:plugins.host.dashboard.nice'),
                  t('in-forge:plugins.host.dashboard.steal')
                ],
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          )}
        </DashboardSection>

        {isAixOs(snapshot) && (
          <DashboardSection title={t('in-forge:plugins.host.dashboard.cpuEvents')}>
            <Chart
              snapshotId={snapshot.get('id')}
              snapshotHostFqdn={snapshot.getIn(['data', 'fqdn'])}
              hasActionlane
              timeConfig={timeConfig}
              y1={{
                formatter: number.compact,
                metrics: ['cpu.contextSwitches', 'cpu.deviceInterrupts'],
                labels: [
                  t('in-forge:plugins.host.dashboard.aixContextSwitches'),
                  t('in-forge:plugins.host.dashboard.aixDeviceInterrupts')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}

        {isLinux(snapshot) && (
          <DashboardSection title={t('in-forge:plugins.host.dashboard.contextSwitches')}>
            <Chart
              snapshotId={snapshot.get('id')}
              snapshotHostFqdn={snapshot.getIn(['data', 'fqdn'])}
              hasActionlane
              timeConfig={timeConfig}
              y1={{
                formatter: number.compact,
                metrics: ['ctxt'],
                labels: [t('in-forge:plugins.host.dashboard.contextSwitches')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}

        {!(isWindows(snapshot) || isZos(snapshot)) && (
          <DashboardSection title={t('in-forge:plugins.host.dashboard.cpuLoad')}>
            <Chart
              snapshotId={snapshot.get('id')}
              snapshotHostFqdn={snapshot.getIn(['data', 'fqdn'])}
              hasActionlane
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: twoDecimalPlaces,
                tooltipFormatter: twoDecimalPlaces,
                metrics: ['load.1min'],
                labels: [t('in-forge:plugins.host.dashboard.load')],
                type: 'stackedArea'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
      </Columize>

      {!isIbmiOs(snapshot) && <CpuTable snapshot={snapshot} timeConfig={timeConfig} />}

      {gpuInfoAvailable && <GpuTable snapshot={snapshot} timeConfig={timeConfig} />}
      {gpuInfoAvailable && <GpuProcessList snapshot={snapshot} timeConfig={timeConfig} />}
      {!isIbmiOs(snapshot) && (
        <DashboardSection title={t('in-forge:plugins.host.dashboard.memory')}>
          {!isLinux(snapshot) && (
            <Chart
              snapshotId={snapshot.get('id')}
              snapshotHostFqdn={snapshot.getIn(['data', 'fqdn'])}
              hasActionlane
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: percentageZeroDecimalPlaces,
                metrics: memoryUsedMetrics,
                labels: memoryUsedMetricsLabels,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          )}
          {isLinux(snapshot) && (
            <Chart
              snapshotId={snapshot.get('id')}
              snapshotHostFqdn={snapshot.getIn(['data', 'fqdn'])}
              hasActionlane
              timeConfig={timeConfig}
              y1={{
                 min: 0,
                 formatter: bytes.detailed,
                 metrics: ['memory.total'],
                 labels: [t('in-forge:plugins.host.total')],
                 type: 'line'
              }}
              y2={{
                 min: 0,
                 formatter: percentageZeroDecimalPlaces,
                 metrics: memoryUsedMetrics,
                 labels: memoryUsedMetricsLabels,
                 type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          )}
          {isAixOs(snapshot) && (
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytes.detailed,
                metrics: ['memory.computational', 'memory.nonComputational', 'memory.realAvailable'],
                labels: [
                  t('in-forge:plugins.host.dashboard.computational'),
                  t('in-forge:plugins.host.dashboard.nonComputational'),
                  t('in-forge:plugins.host.dashboard.realAvailable')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          )}
          {isLinux(snapshot) && (
            <Chart
              snapshotId={snapshot.get('id')}
              snapshotHostFqdn={snapshot.getIn(['data', 'fqdn'])}
              hasActionlane
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytes.detailed,
                metrics: ['memory.buffers', 'memory.cached', 'memory.available'],
                labels: [
                  t('in-forge:plugins.host.dashboard.buffers'),
                  t('in-forge:plugins.host.dashboard.cached'),
                  t('in-forge:plugins.host.dashboard.available')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          )}
          {(isLinux(snapshot) || isAixOs(snapshot)) && (
            <Chart
              snapshotId={snapshot.get('id')}
              snapshotHostFqdn={snapshot.getIn(['data', 'fqdn'])}
              hasActionlane
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytes.detailed,
                metrics: ['memory.swapTotal', 'memory.swapFree'],
                labels: [t('in-forge:plugins.host.dashboard.swapTotal'), t('in-forge:plugins.host.dashboard.swapFree')],
                type: 'line'
              }}
              y2={{
                min: 0,
                max: 1,
                formatter: percentageTwoDecimalPlaces,
                tooltipFormatter: percentageTwoDecimalPlaces,
                metrics: ['memory.swapUsed'],
                labels: [t('in-forge:plugins.host.dashboard.swapUsed')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          )}
          {(isLinux(snapshot)) && (
            <Chart
              snapshotId={snapshot.get('id')}
              snapshotHostFqdn={snapshot.getIn(['date', 'fqdn'])}
              hasActionlane
              timeConfig={timeConfig}
              y1={{
                min:0,
                formatter: bytes.detailed,
                metrics: ['memory.virtualTotal', 'memory.virtualUsed', 'memory.virtualFree'],
                labels: [
                  t('in-forge:plugins.host.dashboard.virtualTotal'),
                  t('in-forge:plugins.host.dashboard.virtualUsed'),
                  t('in-forge:plugins.host.dashboard.virtualFree')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          )}
          {(isLinux(snapshot)) && (
            <Chart
              snapshotId={snapshot.get('id')}
              snapshotHostFqdn={snapshot.getIn(['data', 'fqdn'])}
              hasActionlane
              timeConfig={timeConfig}
              y1={{
                min:0,
                formatter: bytes.detailed,
                metrics: ['memory.shared'],
                labels: [t('in-forge:plugins.host.dashboard.shared')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          )}
          {isAixOs(snapshot) && (
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytes.detailed,
                metrics: ['memory.virtualTotal', 'memory.virtualFree', 'memory.virtualActive'],
                labels: [
                  t('in-forge:plugins.host.dashboard.virtualTotal'),
                  t('in-forge:plugins.host.dashboard.virtualFree'),
                  t('in-forge:plugins.host.dashboard.virtualActive')
                ],
                type: 'line'
              }}
              y2={{
                min: 0,
                max: 1,
                formatter: percentageTwoDecimalPlaces,
                tooltipFormatter: percentageTwoDecimalPlaces,
                metrics: ['memory.virtualUsedCalc'],
                labels: [t('in-forge:plugins.host.dashboard.virtualUsed')],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          )}
          {isAixOs(snapshot) && (
            <Chart
              snapshotId={snapshot.get('id')}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: [
                  'memory.pageIn',
                  'memory.pageOut',
                  'memory.pageScan',
                  'memory.pageFaults',
                  'memory.pageReclaims'
                ],
                labels: [
                  t('in-forge:plugins.host.dashboard.pageIn'),
                  t('in-forge:plugins.host.dashboard.pageOut'),
                  t('in-forge:plugins.host.dashboard.pageScan'),
                  t('in-forge:plugins.host.dashboard.pageFaults'),
                  t('in-forge:plugins.host.dashboard.pageReclaims')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          )}
        </DashboardSection>
      )}

      {isAixOs(snapshot) && (
        <DashboardSection title={t('in-forge:plugins.host.dashboard.systemEvents')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: [
                'cpu.systemReads',
                'cpu.systemWrites',
                'cpu.blockReads',
                'cpu.blockWrites',
                'cpu.nonBlockReads',
                'cpu.nonBlockWrites',
                'cpu.logicalBlockReads',
                'cpu.logicalBlockWrites'
              ],
              labels: [
                t('in-forge:plugins.host.dashboard.systemReads'),
                t('in-forge:plugins.host.dashboard.systemWrites'),
                t('in-forge:plugins.host.dashboard.blockReads'),
                t('in-forge:plugins.host.dashboard.blockWrites'),
                t('in-forge:plugins.host.dashboard.nonBlockReads'),
                t('in-forge:plugins.host.dashboard.nonBlockWrites'),
                t('in-forge:plugins.host.dashboard.logicalBlockReads'),
                t('in-forge:plugins.host.dashboard.logicalBlockWrites')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      {isAixOs(snapshot) && <VolumeGroups snapshot={snapshot} timeConfig={timeConfig} />}
      {isAixOs(snapshot) && <PhysicalVolume snapshot={snapshot} timeConfig={timeConfig} />}
      {isAixOs(snapshot) && <Disks snapshot={snapshot} timeConfig={timeConfig} />}
      {supportsOpenFiles(snapshot) && (
        <DashboardSection title={t('in-forge:plugins.host.dashboard.openFiles')}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: siPrefix.compact,
              tooltipFormatter: number.compact,
              metrics: ['openFiles.current'],
              labels: [t('in-forge:plugins.host.dashboard.current')],
              type: 'line'
            }}
            y2={{
              min: 0,
              max: 1,
              formatter: percentageTwoDecimalPlaces,
              tooltipFormatter: percentageTwoDecimalPlaces,
              metrics: ['openFiles.used'],
              labels: [t('in-forge:plugins.host.dashboard.used')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <FilesystemsTable snapshot={snapshot} timeConfig={timeConfig} />
      {isLinux(snapshot) && <DiskTable snapshotId={snapshot.get('id')} timeConfig={timeConfig} />}

      <NetworkInterfacesTable snapshot={snapshot} timeConfig={timeConfig} />

      {!isIbmiOs(snapshot) && (
        <DashboardSection title={t('in-forge:plugins.host.dashboard.tcpActivity')}>
          <Chart
            snapshotId={snapshot.get('id')}
            snapshotHostFqdn={snapshot.getIn(['data', 'fqdn'])}
            hasActionlane
            timeConfig={timeConfig}
            customHeight={300}
            y1={{
              type: 'line',
              metrics: ['tcp.established', 'tcp.opens', 'tcp.inSegs', 'tcp.outSegs'],
              labels: [
                t('in-forge:plugins.host.dashboard.established'),
                t('in-forge:plugins.host.dashboard.openS'),
                t('in-forge:plugins.host.dashboard.inSegmentsS'),
                t('in-forge:plugins.host.dashboard.outSegmentsS')
              ],
              formatter: zeroDecimalPlaces,
              tooltipFormatter: twoDecimalPlaces
            }}
            y2={{
              type: 'line',
              metrics: ['tcp.establishedResets', 'tcp.resets', 'tcp.fails', 'tcp.errors', 'tcp.retrans'],
              labels: [
                t('in-forge:plugins.host.dashboard.establishedResets'),
                t('in-forge:plugins.host.dashboard.outResets'),
                t('in-forge:plugins.host.dashboard.fail'),
                t('in-forge:plugins.host.dashboard.error'),
                t('in-forge:plugins.host.dashboard.retransmission')
              ],
              min: 0,
              max: 1,
              formatter: percentageZeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      )}

      <ProcessTopList snapshot={snapshot} />

      {isWindows(snapshot) && <WinServicesTable snapshot={snapshot} />}

      <CompanionMetrics companions$={getHostCompanions(snapshot.get('id'))} timeConfig={timeConfig} />

      {role.canConfigureAgents && (
        <DashboardSection title={t('in-forge:plugins.host.dashboard.agentManagement')}>
          <div className={locals.agentManagementContent}>
            <div className={locals.agentManagementDescription}>
              <p>{t('in-forge:plugins.host.dashboard.theInstanaAgentHasManagementAndSelfMonitoringCapabilities')}</p>
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
