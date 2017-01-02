import React from 'react';

import {timeByMillisTwoDecimalPlaces, bytesTwoDecimalPlaces, zeroDecimalPlaces} from 'in-services/formatters/number';
import {KpiSection, KpiHeading} from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import TwoColumnRow from 'in-sdk/components/dashboard/TwoColumnRow';
import ChartWithLegend from 'in-components/ChartWithLegend';
import {getLabel} from 'in-sdk/snapshot';


export default function PythonDashboard({snapshot, timeframe}) {
  return (
    <div>
      <KpiSection>
        <KpiHeading>
          {getLabel(snapshot)}
        </KpiHeading>
      </KpiSection>

      <TwoColumnRow>
        <DashboardSection title='GC Activity'>
          {renderGcMetrics(snapshot, timeframe)}
        </DashboardSection>

        <DashboardSection title='Memory Usage'>
          {renderMemoryMetrics(snapshot, timeframe)}
        </DashboardSection>
      </TwoColumnRow>

      <TwoColumnRow>
        <DashboardSection title='Threads'>
          {renderThreadsMetrics(snapshot, timeframe)}
        </DashboardSection>
        <DashboardSection title='Time Spent'>
          {renderTimeMetrics(snapshot, timeframe)}
        </DashboardSection>
      </TwoColumnRow>

      <TwoColumnRow>
        <DashboardSection title='Paging'>
          {renderPagingMetrics(snapshot, timeframe)}
        </DashboardSection>

        <DashboardSection title='I/O'>
          {renderIoMetrics(snapshot, timeframe)}
        </DashboardSection>
      </TwoColumnRow>

      <TwoColumnRow>
        <DashboardSection title='Events'>
          {renderEventsMetrics(snapshot, timeframe)}
        </DashboardSection>

        <DashboardSection title='Context Switching'>
          {renderContextMetrics(snapshot, timeframe)}
        </DashboardSection>
      </TwoColumnRow>
    </div>
  );
}

function renderTimeMetrics(snapshot, timeframe) {
  return (
    <ChartWithLegend snapshotId={snapshot.get('id')}
                     timeframe={timeframe}
                     margins={{
                       left: 60,
                       right: 60
                     }}
                     y1={{
                       min: 0,
                       formatter: timeByMillisTwoDecimalPlaces,
                       metrics: [
                         'metrics.ru_utime',
                         'metrics.ru_stime'
                       ],
                       labels: [
                         'In User Mode',
                         'In System Mode'
                       ],
                       type: 'line'
                     }} />
  );
}

function renderMemoryMetrics(snapshot, timeframe) {
  return (
    <ChartWithLegend snapshotId={snapshot.get('id')}
                     timeframe={timeframe}
                     margins={{
                       left: 60,
                       right: 60
                     }}
                     y1={{
                       min: 0,
                       formatter: bytesTwoDecimalPlaces,
                       metrics: [
                         'metrics.ru_ixrss',
                         'metrics.ru_idrss',
                         'metrics.ru_maxrss',
                         'metrics.ru_isrss'
                       ],
                       labels: [
                         'Shared Memory',
                         'Unshared Memory',
                         'Maximum Resident Set Size',
                         'Unshared Stack Size'
                       ],
                       type: 'line'
                     }} />
  );
}

function renderGcMetrics(snapshot, timeframe) {
  return (
    <ChartWithLegend snapshotId={snapshot.get('id')}
                     timeframe={timeframe}
                     margins={{
                       left: 60,
                       right: 60
                     }}
                     y1={{
                       min: 0,
                       formatter: zeroDecimalPlaces,
                       metrics: [
                         'metrics.gc.collect0',
                         'metrics.gc.threshold0'
                       ],
                       labels: [
                         'Collect 0',
                         'Threshold 0'
                       ],
                       type: 'line'
                     }}

                     y2={{
                       min: 0,
                       formatter: zeroDecimalPlaces,
                       metrics: [
                         'metrics.gc.collect1',
                         'metrics.gc.threshold1',
                         'metrics.gc.collect2',
                         'metrics.gc.threshold2',
                       ],
                       labels: [
                         'Collect 1',
                         'Threshold 1',
                         'Collect 2',
                         'Threshold 2'
                       ],
                       type: 'line'
                     }} />
  );
}

function renderPagingMetrics(snapshot, timeframe) {
  return (
    <ChartWithLegend snapshotId={snapshot.get('id')}
                     timeframe={timeframe}
                     margins={{
                       left: 60,
                       right: 60
                     }}
                     y1={{
                       min: 0,
                       formatter: zeroDecimalPlaces,
                       metrics: [
                         'metrics.ru_minflt',
                         'metrics.ru_majflt',
                         'metrics.ru_nswap'
                       ],
                       labels: [
                         'Page Faults Not Requiring I/O',
                         'Page Faults Requiring I/O',
                         'Swap Outs'
                       ],
                       type: 'line'
                     }} />
  );
}

function renderThreadsMetrics(snapshot, timeframe) {
  return (
    <ChartWithLegend snapshotId={snapshot.get('id')}
                     timeframe={timeframe}
                     margins={{
                       left: 60,
                       right: 60
                     }}
                     y1={{
                       min: 0,
                       formatter: zeroDecimalPlaces,
                       metrics: [
                         'metrics.alive_threads',
                         'metrics.dead_threads',
                         'metrics.daemon_threads'
                       ],
                       labels: [
                         'Alive Threads',
                         'Dead Threads',
                         'Daemon Threads'
                       ],
                       type: 'stackedArea'
                     }} />
  );
}

function renderIoMetrics(snapshot, timeframe) {
  return (
    <ChartWithLegend snapshotId={snapshot.get('id')}
                     timeframe={timeframe}
                     margins={{
                       left: 60,
                       right: 60
                     }}
                     y1={{
                       min: 0,
                       formatter: zeroDecimalPlaces,
                       metrics: [
                         'metrics.ru_inblock',
                         'metrics.ru_oublock'
                       ],
                       labels: [
                         'Block Input Operations',
                         'Block Output Operations'
                       ],
                       type: 'line'
                     }} />
  );
}

function renderEventsMetrics(snapshot, timeframe) {
  return (
    <ChartWithLegend snapshotId={snapshot.get('id')}
                     timeframe={timeframe}
                     margins={{
                       left: 60,
                       right: 60
                     }}
                     y1={{
                       min: 0,
                       formatter: zeroDecimalPlaces,
                       metrics: [
                         'metrics.ru_msgsnd',
                         'metrics.ru_msgrcv',
                         'metrics.ru_nsignals'
                       ],
                       labels: [
                         'Messages Sent',
                         'Messages Received',
                         'Signals Received'
                       ],
                       type: 'line'
                     }} />
  );
}

function renderContextMetrics(snapshot, timeframe) {
  return (
    <ChartWithLegend snapshotId={snapshot.get('id')}
                     timeframe={timeframe}
                     margins={{
                       left: 60,
                       right: 60
                     }}
                     y1={{
                       min: 0,
                       formatter: zeroDecimalPlaces,
                       metrics: [
                         'metrics.ru_nvcsw',
                         'metrics.ru_nivcsw'
                       ],
                       labels: [
                         'Voluntary',
                         'Involuntary'
                       ],
                       type: 'line'
                     }} />
  );
}
