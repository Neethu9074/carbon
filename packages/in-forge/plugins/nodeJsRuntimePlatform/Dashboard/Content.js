/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import HealthchecksTable from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/HealthchecksTable';
import HttpServersTable from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/HttpServersTable';
import ModuleAnalysisDialog from 'in-forge/plugins/nodeJsRuntimePlatform/ModuleAnalysisDialog';
import HeapSpacesTable from 'in-forge/plugins/nodeJsRuntimePlatform/Dashboard/HeapSpacesTable';
import getMonitoringIssuesForSnapshot from 'in-subscription/getMonitoringIssuesForSnapshot';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { bytes, time, twoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { Col, Row } from 'in-new-components/layout/Grid';
import MetricValue from 'in-components/MetricValue';
import { getCodeView } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t, Trans } from 'in-i18n';

export default connectTo(({ snapshot, timeConfig }) => {
  const snapshotId = snapshot.get('id');
  return {
    isInternalVisible: isInternalVisible$,
    monitoringIssues: getMonitoringIssuesForSnapshot({ timeConfig, snapshotId })
      .filter(issuesResult => issuesResult && issuesResult.get('data'))
      .map(issuesResult => issuesResult.get('data'))
      .startWith(null)
  };
})(function NodejsDashboard({ snapshot, timeConfig, isInternalVisible, monitoringIssues }) {
  const snapshotId = snapshot.get('id');
  const gcStatsSupported = snapshot.getIn(['data', 'gc.statsSupported']);
  return (
    <div>
      {getInitializedTooLateHint(snapshot, isInternalVisible, monitoringIssues)}
      {getNativeExtensionHint(snapshot)}

      <KpiSection>
        {gcStatsSupported ? (
          <KpiKeyValue label={t('in-forge:plugins.nodeJsRuntimePlatform.gcPause')}>
            <MetricValue snapshotId={snapshotId} metric="gc.gcPause" formatter={time} />
          </KpiKeyValue>
        ) : null}
        <KpiKeyValue label={t('in-forge:plugins.nodeJsRuntimePlatform.rss')}>
          <MetricValue snapshotId={snapshotId} metric="memory.rss" formatter={bytes.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.nodeJsRuntimePlatform.heapUsed')}>
          <MetricValue snapshotId={snapshotId} metric="memory.heapUsed" formatter={bytes.detailed} />
        </KpiKeyValue>
        {snapshot.getIn(['data', 'libuv.statsSupported']) ? (
          <KpiKeyValue label={t('in-forge:plugins.nodeJsRuntimePlatform.totalTimeSpentInLoopPerSecond')}>
            <MetricValue snapshotId={snapshotId} metric="libuv.sum" formatter={time} />
          </KpiKeyValue>
        ) : null}
        <KpiKeyValue label={t('in-forge:plugins.nodeJsRuntimePlatform.eventLloopLag')}>
          <MetricValue snapshotId={snapshotId} metric="libuv.lag" formatter={time} />
        </KpiKeyValue>
      </KpiSection>

      {isInternalVisible && (
        <Row withBottomMargin>
          <Col xs>
            <Button onClick={() => getSource(snapshot)} kind="secondary">
              {t('in-forge:plugins.nodeJsRuntimePlatform.getSourceForArbitraryFile')}
            </Button>
          </Col>
          <Col xs>
            <Button onClick={() => getModuleAnalysis(snapshot)} kind="secondary">
              {t('in-forge:plugins.nodeJsRuntimePlatform.analyseModules')}
            </Button>
          </Col>
        </Row>
      )}

      <DashboardSection title={t('in-forge:plugins.nodeJsRuntimePlatform.memoryUsage')}>
        {renderGcMetrics(snapshot, timeConfig)}
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.nodeJsRuntimePlatform.gcActivity')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: time,
            metrics: ['gc.gcPause'],
            labels: [t('in-forge:plugins.nodeJsRuntimePlatform.gcPause')],
            type: 'stackedArea'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <HeapSpacesTable snapshot={snapshot} timeConfig={timeConfig} />

      <DashboardSection title={t('in-forge:plugins.nodeJsRuntimePlatform.eventLoop')}>
        {renderEventLoopMetrics(snapshot, timeConfig)}
      </DashboardSection>

      <DashboardSection title={t('in-forge:plugins.nodeJsRuntimePlatform.handlesAmpRequests')}>
        <Chart
          snapshotId={snapshot.get('id')}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['activeHandles', 'activeRequests'],
            labels: [
              t('in-forge:plugins.nodeJsRuntimePlatform.handles'),
              t('in-forge:plugins.nodeJsRuntimePlatform.requests')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>

      <HealthchecksTable snapshot={snapshot} timeConfig={timeConfig} />

      <HttpServersTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
});

function renderGcMetrics(snapshot, timeConfig) {
  if (snapshot.getIn(['data', 'gc.statsSupported'])) {
    return (
      <Chart
        snapshotId={snapshot.get('id')}
        timeConfig={timeConfig}
        y1={{
          min: 0,
          formatter: bytes.detailed,
          tooltipFormatter: bytes.detailedWithRaw,
          metrics: ['memory.rss', 'memory.heapUsed', 'gc.usedHeapSizeAfterGc'],
          labels: [
            t('in-forge:plugins.nodeJsRuntimePlatform.rss'),
            t('in-forge:plugins.nodeJsRuntimePlatform.heapSize'),
            t('in-forge:plugins.nodeJsRuntimePlatform.heapSizeAfterGc')
          ],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: twoDecimalPlaces,
          metrics: ['gc.minorGcs', 'gc.majorGcs'],
          labels: [
            t('in-forge:plugins.nodeJsRuntimePlatform.minorGCs'),
            t('in-forge:plugins.nodeJsRuntimePlatform.majorGCs')
          ],
          type: 'point'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    );
  }

  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: bytes.detailed,
        tooltipFormatter: bytes.detailedWithRaw,
        metrics: ['memory.rss', 'memory.heapUsed'],
        labels: [t('in-forge:plugins.nodeJsRuntimePlatform.rss'), t('in-forge:plugins.nodeJsRuntimePlatform.heapSize')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function renderEventLoopMetrics(snapshot, timeConfig) {
  if (snapshot.getIn(['data', 'libuv.statsSupported'])) {
    return (
      <Chart
        snapshotId={snapshot.get('id')}
        timeConfig={timeConfig}
        y1={{
          min: 0,
          formatter: time,
          metrics: ['libuv.max', 'libuv.sum', 'libuv.lag'],
          labels: [
            t('in-forge:plugins.nodeJsRuntimePlatform.longestTimeSpentInASingleLoop'),
            t('in-forge:plugins.nodeJsRuntimePlatform.totalTimeSpentInLoop'),
            t('in-forge:plugins.nodeJsRuntimePlatform.eventLloopLag')
          ],
          type: 'line'
        }}
        y2={{
          min: 0,
          formatter: twoDecimalPlaces,
          metrics: ['libuv.num'],
          labels: [t('in-forge:plugins.nodeJsRuntimePlatform.loopsPerSecond')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    );
  }

  return (
    <Chart
      snapshotId={snapshot.get('id')}
      timeConfig={timeConfig}
      y1={{
        min: 0,
        formatter: time,
        metrics: ['libuv.lag'],
        labels: [t('in-forge:plugins.nodeJsRuntimePlatform.eventLloopLag')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}

function getInitializedTooLateHint(snapshot, isInternalVisible, monitoringIssues) {
  // Note: This mechanism for warning the user about the initialized-too-late issue is deprecated and replaced by the
  // monitoring issues mechanism. We only keep this mechnism around until
  // * the agentMonitoringIssuesEnabled feature flag has been enabled for all TUs (or the feature flag has been removed
  //   entirely) and then also for another few months AND
  // *  we can reasonably expect that most users have upgraded to a version of @instana/collector that sends monitoring
  //    issues (support for that arrived in July/August 2020).
  // The latter condition will probably become true much later than the first, given how sloppy some customers are with
  // updating @instana/collector.

  const probablyInitializedTooLate = snapshot.getIn(['data', 'initTooLate']);

  if (!probablyInitializedTooLate) {
    return null;
  }

  // Check if we also show the monitoring issue notification for this problem, to avoid showing both (the monitoring
  // issue notification and the old dashboard notification)
  const monitoringIssueNotificationExists = monitoringIssues?.find(
    issue => issue.get('agentMonitoringCode') === 'nodejs_collector_initialized_too_late'
  );
  const monitoringIssueNotificationIsShown = isInternalVisible || agentMonitoringIssuesEnabled;

  if (monitoringIssueNotificationExists && monitoringIssueNotificationIsShown) {
    return null;
  }

  return (
    <DashboardNotification type="danger">
      <Trans
        i18nKey="in-forge:plugins.nodeJsRuntimePlatform.itSeemsYouHaveInitializedTheInstanaCollectorPackageTooLate"
        components={{
          installLink: (
            <a href="https://instana.com/docs/ecosystem/node-js/installation/#installing-the-nodejs-collector-package" />
          ),
          pitfallsLink: <a href="https://instana.com/docs/ecosystem/node-js/installation/#common-pitfalls" />
        }}
      />
    </DashboardNotification>
  );
}

function getNativeExtensionHint(snapshot) {
  const libuvMonitoringSupported = snapshot.getIn(['data', 'libuv.statsSupported']);
  const gcMonitoringSupported = snapshot.getIn(['data', 'gc.statsSupported']);

  if (libuvMonitoringSupported && gcMonitoringSupported) {
    return null;
  }

  const missingNativeExtensions = [];
  if (!libuvMonitoringSupported) {
    missingNativeExtensions.push('event loop');
  }

  if (!gcMonitoringSupported) {
    missingNativeExtensions.push('garbage collection');
  }

  return (
    <DashboardNotification type="info">
      <Trans
        i18nKey="in-forge:plugins.nodeJsRuntimePlatform.nativeExtensionsCouldNotBeLoaded"
        values={{ missingNativeExtensions: missingNativeExtensions.join(' and ') }}
        components={{
          installLink: <a href="https://instana.com/docs/ecosystem/node-js/installation/#native-addons" />
        }}
      />
    </DashboardNotification>
  );
}

function getSource(snapshot) {
  const filename = prompt(t('in-forge:plugins.nodeJsRuntimePlatform.pleaseProvideTheAbsolutePathToTheJsFile'));
  if (!filename) {
    return;
  }
  addActiveDialog(getCodeView(snapshot, filename));
}

function getModuleAnalysis(snapshot) {
  addActiveDialog(<ModuleAnalysisDialog snapshot={snapshot} />);
}
