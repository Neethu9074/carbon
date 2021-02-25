/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import globalHighlightAction from 'in-components/Chart/components/ContextMenu/actions/globalHighlight';
import MarkerLanesPresenter from 'in-components/Chart/markerLanes/MarkerLanesPresenter';
import { percentage, bytesTwoDecimalPlaces, time } from 'in-services/formatters/number';
import ProfilesLane from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfilesLane';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

import locals from './ProfileChart.mless';

function ProfileChart({ profileTimestamps, timeConfig, processId, y1, y2 }) {
  return (
    <div className={locals.chartWrapper}>
      <Chart
        snapshotId={processId}
        timeConfig={timeConfig}
        y1={y1}
        y2={y2}
        renderPostChartContent={props => <ProfilesMarkerLanes {...props} profileTimestamps={profileTimestamps} />}
        primaryContextMenuAction={globalHighlightAction.name}
      />
    </div>
  );
}

function ProfilesMarkerLanes(props) {
  return (
    <MarkerLanesPresenter {...props}>
      <ProfilesLane />
    </MarkerLanesPresenter>
  );
}

export function CpuProfileChart(props) {
  return <ProfileChart {...props} y1={getCpuMetrics()} y2={getJvmMetrics(props.jvmSnapshot)} />;
}

export function MemoryProfileChart(props) {
  return <ProfileChart {...props} y1={getMemoryMetrics()} />;
}

export function OverviewProfileChart(props) {
  return (
    <ProfileChart
      {...props}
      y1={getCpuMetrics()}
      y2={getMemoryMetrics()}
      profileTimestamps={mergeTimestamps(props.profiles)}
    />
  );
}

function getCpuMetrics() {
  return {
    metrics: ['cpu.user', 'cpu.sys'],
    labels: [t('in-profiling:cpuUser'), t('in-profiling:cpuSystem')],
    formatter: percentage,
    type: 'line'
  };
}

function getMemoryMetrics() {
  return {
    metrics: ['mem.virtual', 'mem.resident', 'mem.share'],
    labels: [t('in-profiling:virtual'), t('in-profiling:resident'), t('in-profiling:share')],
    formatter: bytesTwoDecimalPlaces,
    type: 'line'
  };
}

function getJvmMetrics(jvmSnapshot) {
  if (jvmSnapshot) {
    const collectors = jvmSnapshot.getIn(['data', 'jvm.collectors'])?.toArray();
    if (collectors?.length > 0) {
      return {
        snapshotId: jvmSnapshot.get('id'),
        metrics: collectors.map(name => 'gc.' + name + '.time'),
        labels: collectors.map(name => name + ' Time'),
        formatter: time,
        type: 'line'
      };
    }
  }
}

function mergeTimestamps(profiles) {
  const cpuTimestamps = profiles?.cpuProfile?.rawProfileTimestamps ?? [];
  const memoryTimestamps = profiles?.memoryProfile?.rawProfileTimestamps ?? [];
  const timeTimestamps = profiles?.timeProfile?.rawProfileTimestamps ?? [];

  const sortedUniqueTimestamps = Array.from(
    new Set([...cpuTimestamps, ...memoryTimestamps, ...timeTimestamps]).values()
  ).sort((a, b) => a - b);
  return sortedUniqueTimestamps;
}
