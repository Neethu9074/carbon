/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { bytes, number, timeByMillisFourDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { t } from 'in-i18n';

export default function PythonDashboard({ snapshot, timeConfig }) {
  return (
    <div>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.pythonRuntimePlatform.dashboard.gcActivity')}>
          {renderGcMetrics(snapshot, timeConfig)}
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.pythonRuntimePlatform.dashboard.memoryUsage')}>
          {renderMemoryMetrics(snapshot, timeConfig)}
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.pythonRuntimePlatform.dashboard.threads')}>
          {renderThreadsMetrics(snapshot, timeConfig)}
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.pythonRuntimePlatform.dashboard.timeSpent')}>
          {renderTimeMetrics(snapshot, timeConfig)}
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.pythonRuntimePlatform.dashboard.paging')}>
          {renderPagingMetrics(snapshot, timeConfig)}
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.pythonRuntimePlatform.dashboard.iO')}>
          {renderIoMetrics(snapshot, timeConfig)}
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.pythonRuntimePlatform.dashboard.events')}>
          {renderEventsMetrics(snapshot, timeConfig)}
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.pythonRuntimePlatform.dashboard.contextSwitching')}>
          {renderContextMetrics(snapshot, timeConfig)}
        </DashboardSection>
      </Columize>
    </div>
  );
}

function renderTimeMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: timeByMillisFourDecimalPlaces,
        metrics: ['metrics.ru_utime', 'metrics.ru_stime'],
        labels: [
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.inUserMode'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.inSystemMode')
        ],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderMemoryMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: bytes.detailed,
        metrics: ['metrics.ru_ixrss', 'metrics.ru_idrss', 'metrics.ru_maxrss', 'metrics.ru_isrss'],
        labels: [
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.sharedMemory'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.unsharedMemory'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.maximumResidentSetSize'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.unsharedStackSize')
        ],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderGcMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.gc.collect0', 'metrics.gc.threshold0'],
        labels: [
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.collect0'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.threshold0')
        ],
        type: 'line'
      }}
      y2={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.gc.collect1', 'metrics.gc.threshold1', 'metrics.gc.collect2', 'metrics.gc.threshold2'],
        labels: [
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.collect1'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.threshold1'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.collect2'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.threshold2')
        ],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderPagingMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.ru_minflt', 'metrics.ru_majflt', 'metrics.ru_nswap'],
        labels: [
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.pageFaultsNotRequiringIO'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.pageFaultsRequiringIO'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.swapOuts')
        ],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderThreadsMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.alive_threads', 'metrics.dummy_threads', 'metrics.daemon_threads'],
        labels: [
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.aliveThreads'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.dummyThreads'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.daemonThreads')
        ],
        type: 'stackedArea'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderIoMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.ru_inblock', 'metrics.ru_oublock'],
        labels: [
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.blockInputOperations'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.blockOutputOperations')
        ],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderEventsMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.ru_msgsnd', 'metrics.ru_msgrcv', 'metrics.ru_nsignals'],
        labels: [
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.messagesSent'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.messagesReceived'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.signalsReceived')
        ],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderContextMetrics(snapshot, timeConfig) {
  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: ['metrics.ru_nvcsw', 'metrics.ru_nivcsw'],
        labels: [
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.voluntary'),
          t('in-forge:plugins.pythonRuntimePlatform.dashboard.involuntary')
        ],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
