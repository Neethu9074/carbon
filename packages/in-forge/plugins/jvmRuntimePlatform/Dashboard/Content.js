/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { List, Map } from 'immutable';
import React from 'react';

import { Button } from '@instana/components';

import { bytes, timeByMicroTwoDecimalPlaces, time, twoDecimalPlaces, percentage } from 'in-services/formatters/number';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import PackageRetrievalDialog from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/PackageRetrievalDialog';
import DiagnosticInfoDialog from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/DiagnosticInfoDialog';
import MicrometerMetrics from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/MicrometerMetrics';
import MemoryPoolsTable from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/MemoryPoolsTable';
import ThreadDumpButton from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/ThreadDumpButton';
import JmxMetricsTable from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/JmxMetricsTable';
import HeapDumpButton from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/HeapDumpButton';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import createAgentResponseObservable from 'in-subscription/agentResponse';
import DiagnosticCommandPresenter from './DiagnosticCommandPresenter';
import getAgentSnapshotId from 'in-subscription/getAgentSnapshotId';
import { alwaysNull } from 'in-services/fixedStreams';
import MetricValue from 'in-components/MetricValue';
import { getSnapshot } from 'in-stores/snapshot';
import { getCodeView } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t, Trans } from 'in-i18n';

export default connectTo(
  props => ({
    isInternalVisible: isInternalVisible$,
    agentSnapshot: isInternalVisible$
      .flatMap(enabled => (enabled ? getAgentSnapshotId(props.snapshot) : alwaysNull))
      // get snapshot to ensure that the agent snapshot can be found
      .flatMap(snapshotId => (snapshotId ? getSnapshot(snapshotId) : alwaysNull))
  }),
  JVMDashboard
);

function JVMDashboard({ snapshot, timeConfig, isInternalVisible, agentSnapshot }) {
  const collectors = snapshot.getIn(['data', 'jvm.collectors']);
  const snapshotId = snapshot.get('id');

  const availableDiagnosticCommands = parseAvailableDiagnosticCommands(agentSnapshot);
  const isDiagnosticsVisible = List.isList(availableDiagnosticCommands) && availableDiagnosticCommands.size > 0;
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.jvmRuntimePlatform.memoryUsed')}>
          <MetricValue snapshotId={snapshotId} metric="memory.used" formatter={bytes.detailed} />
        </KpiKeyValue>

        {isInternalVisible && (
          <Button onClick={() => getSource(snapshot)} kind="secondary">
            {t('in-forge:plugins.jvmRuntimePlatform.getSourceForArbitraryClass')}
          </Button>
        )}
        {isInternalVisible && (
          <Button onClick={() => getPackage(snapshot)} kind="secondary">
            {t('in-forge:plugins.jvmRuntimePlatform.getClassesForArbitraryPackage')}
          </Button>
        )}
        {isInternalVisible && isDiagnosticsVisible && (
          <DiagnosticCommandPresenter
            snapshot={snapshot}
            commands={availableDiagnosticCommands}
            getDiagnosticInfo={getDiagnosticInfo}
          />
        )}
      </KpiSection>

      <DashboardSection
        title={t('in-forge:plugins.jvmRuntimePlatform.threads')}
        button={
          <span>
            <ThreadDumpButton className="in-jvm-dashboard-thread-dump-button" snapshot={snapshot} />
            <HeapDumpButton className="in-jvm-dashboard-heap-dump-button" snapshot={snapshot} />
          </span>
        }
      >
        <ChartExplanation>
          <Trans i18nKey="in-forge:plugins.jvmRuntimePlatform.theNumberOfThreadsIsQuiteStaticInMostApps" />
        </ChartExplanation>

        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['threads.new', 'threads.runnable', 'threads.timed-waiting', 'threads.waiting', 'threads.blocked'],
            labels: [
              t('in-forge:plugins.jvmRuntimePlatform.new'),
              t('in-forge:plugins.jvmRuntimePlatform.runnable'),
              'Timed-Waiting',
              t('in-forge:plugins.jvmRuntimePlatform.waiting'),
              t('in-forge:plugins.jvmRuntimePlatform.blocked')
            ],
            type: 'stackedArea',
            formatter: twoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.jvmRuntimePlatform.heapMemory')}>
        <ChartExplanation>
          {t('in-forge:plugins.jvmRuntimePlatform.theTotalUsedHeapMemoryUsageWillUsuallyGoUpUntil')}
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: snapshot.getIn(['data', 'memory.max']),
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailedWithRaw,
            metrics: ['memory.used'],
            labels: [t('in-forge:plugins.jvmRuntimePlatform.used')],
            type: 'stackedArea'
          }}
          y2={{
            min: 0,
            metrics: ['memory.usedPercentage'],
            labels: [t('in-forge:plugins.jvmRuntimePlatform.used')],
            formatter: percentage.detailed,
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <MemoryPoolsTable snapshot={snapshot} timeConfig={timeConfig} />

      {collectors ? (
        <DashboardSection title={t('in-forge:plugins.jvmRuntimePlatform.garbageCollection')}>
          <ChartExplanation>
            {t(
              'in-forge:plugins.jvmRuntimePlatform.garbageCollectorsWillReportTheirActivationAndRuntimeAfterTheyHaveFinished'
            )}
          </ChartExplanation>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: collectors.map(name => 'gc.' + name + '.time').toArray(),
              labels: collectors
                .map(name => t('in-forge:plugins.jvmRuntimePlatform.nameTime', { name: name }))
                .toArray(),
              type: 'line',
              formatter: time
            }}
            y2={{
              metrics: collectors.map(name => 'gc.' + name + '.inv').toArray(),
              labels: collectors
                .map(name => t('in-forge:plugins.jvmRuntimePlatform.nameInvocations', { name: name }))
                .toArray(),
              type: 'point',
              formatter: twoDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      ) : null}

      <DashboardSection title={t('in-forge:plugins.jvmRuntimePlatform.suspension')}>
        <ChartExplanation>
          {t(
            'in-forge:plugins.jvmRuntimePlatform.suspensionIsAnIndicationOfHowMuchApplicationExecutionMightHaveBeenDelayed'
          )}
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['suspension.time'],
            labels: [t('in-forge:plugins.jvmRuntimePlatform.suspension')],
            type: 'line',
            formatter: timeByMicroTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <JmxMetricsTable snapshot={snapshot} timeConfig={timeConfig} />

      <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix="Dropwizard" />
      <MicrometerMetrics snapshot={snapshot} timeConfig={timeConfig} titlePrefix="Micrometer" />
    </div>
  );
}

function getSource(snapshot) {
  const className = prompt(t('in-forge:plugins.jvmRuntimePlatform.pleaseProvideTheFullyQualifiedClassName'));
  if (!className) {
    return;
  }
  addActiveDialog(getCodeView(snapshot, className));
}

function getPackage(snapshot) {
  const packageName = prompt(t('in-forge:plugins.jvmRuntimePlatform.pleaseProvideTheFullyQualifiedPackageName'));
  if (!packageName) {
    return;
  }
  addActiveDialog(getPackageView(snapshot, packageName));
}

function getPackageView(snapshot, packageName) {
  return (
    <PackageRetrievalDialog
      snapshot={snapshot}
      packageName={packageName}
      agentResponse$={createAgentResponseObservable({
        action: 'java.package',
        target: snapshot.get('volatileId'),
        args: {
          packageName: packageName
        }
      })}
      lang="java"
    />
  );
}

function getDiagnosticInfo(snapshot, diagnosticCommand) {
  close();
  addActiveDialog(getDiagnosticInfoView(snapshot, diagnosticCommand));
}

function getDiagnosticInfoView(snapshot, diagnosticCommand) {
  return (
    <DiagnosticInfoDialog
      snapshot={snapshot}
      diagnosticCommand={diagnosticCommand}
      agentResponse$={createAgentResponseObservable({
        action: 'java.diagnostics',
        target: snapshot.get('volatileId'),
        args: {
          command: diagnosticCommand
        }
      })}
    />
  );
}

function parseAvailableDiagnosticCommands(agentSnapshot) {
  const emptyList = List();
  if (!Map.isMap(agentSnapshot)) {
    return emptyList;
  }
  const capabilities = agentSnapshot.getIn(['data', 'capabilities']);
  if (!List.isList(capabilities)) {
    return emptyList;
  }
  for (const capability of capabilities) {
    if (Map.isMap(capability)) {
      const javaTraceCommands = capability.get('java-trace-commands');
      if (List.isList(javaTraceCommands) && javaTraceCommands.size > 0) {
        return javaTraceCommands;
      }
    }
  }
  return emptyList;
}
