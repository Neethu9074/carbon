/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces,
  bytesPerSecondTwoDecimalPlaces,
  millis,
  number,
  percentage,
  twoDecimalPlaces,
  time
} from 'in-services/formatters/number';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ConfigurationManagementDialog from 'in-forge/plugins/instanaAgent/Dashboard/ConfigurationManagementDialog';
import ManagementButtonSection from 'in-forge/plugins/instanaAgent/Dashboard/ManagementButtonSection';
import ConfigurationManagement from 'in-forge/plugins/instanaAgent/Dashboard/ConfigurationManagement';
import InfoButtonSection from 'in-forge/plugins/instanaAgent/Dashboard/InfoButtonSection';
import SensorTimingList from 'in-forge/plugins/instanaAgent/Dashboard/SensorTimingList';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import LogStreamer from 'in-forge/plugins/instanaAgent/Dashboard/LogStreamer';
import SpanMetrics from 'in-forge/plugins/instanaAgent/Dashboard/SpanMetrics';
import ImageButton from 'in-forge/plugins/instanaAgent/Dashboard/ImageButton';
import BundleList from 'in-forge/plugins/instanaAgent/Dashboard/BundleList';
import LogMetrics from 'in-forge/plugins/instanaAgent/Dashboard/LogMetrics';
import SensorList from 'in-forge/plugins/instanaAgent/Dashboard/SensorList';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import IssueList from 'in-forge/plugins/instanaAgent/Dashboard/IssueList';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import Columize from 'in-sdk/components/dashboard/Columize';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function InstanaAgentDashboard({ snapshot, timeConfig, isInternalVisible }) {
    const snapshotId = snapshot.get('id');
    return (
      <Fragment>
        <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.management')}>
          <ManagementButtonSection snapshot={snapshot} />
        </DashboardSection>
        <Columize>
          <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.info')}>
            <InfoButtonSection snapshot={snapshot} />
          </DashboardSection>
          <DashboardSection
            title={t('in-forge:plugins.instanaAgent.dashboard.configurationManagement')}
            button={
              role.canConfigureAgents && snapshot.getIn(['data', 'git', 'present']) ? (
                <ImageButton
                  iconType="lib_actions_edit"
                  onClick={() => addActiveDialog(<ConfigurationManagementDialog snapshot={snapshot} />)}
                >
                  {snapshot.getIn(['data', 'git', 'initialized']) ? 'Update' : 'Initialize'}
                </ImageButton>
              ) : null
            }
          >
            <ConfigurationManagement snapshot={snapshot} />
          </DashboardSection>
        </Columize>
        {(agentMonitoringIssuesEnabled || isInternalVisible) && (
          <IssueList snapshot={snapshot} timeConfig={timeConfig} />
        )}
        <Columize>
          {snapshot.getIn(['data', 'hasCpuLoad']) ? (
            <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.cpuLoad')}>
              <Chart
                snapshotId={snapshot.get('id')}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['cpu.load'],
                  labels: [t('in-forge:plugins.instanaAgent.dashboard.load')],
                  type: 'stackedArea',
                  formatter: number.detailed
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
          ) : null}
          <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.memory')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                max: snapshot.getIn(['data', 'memory.total']),
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: ['memory.used'],
                labels: [t('in-forge:plugins.instanaAgent.dashboard.heap')],
                type: 'line'
              }}
              y2={{
                min: 0,
                max: snapshot.getIn(['data', 'memory.nativeTotal']),
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: ['memory.nativeUsed', 'memory.nonHeapUsed'],
                labels: [
                  t('in-forge:plugins.instanaAgent.dashboard.directBuffers'),
                  t('in-forge:plugins.instanaAgent.dashboard.offHeap')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
        <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.garbageCollection')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: time,
              metrics: ['gc.Copy.time', 'gc.MarkSweepCompact.time'],
              labels: [
                t('in-forge:plugins.instanaAgent.dashboard.copyTime'),
                t('in-forge:plugins.instanaAgent.dashboard.markSweepCompactTime')
              ],
              type: 'line'
            }}
            y2={{
              formatter: twoDecimalPlaces,
              metrics: ['gc.Copy.count', 'gc.MarkSweepCompact.count'],
              labels: [
                t('in-forge:plugins.instanaAgent.dashboard.copyInvocation'),
                t('in-forge:plugins.instanaAgent.dashboard.markSweepCompactInvocation')
              ],
              type: 'point'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.network')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesPerSecondZeroDecimalPlaces,
              tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
              metrics: ['net.rx', 'net.tx'],
              labels: [
                t('in-forge:plugins.instanaAgent.dashboard.received'),
                t('in-forge:plugins.instanaAgent.dashboard.sent')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.discovery')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['discovery.time'],
              labels: [t('in-forge:plugins.instanaAgent.dashboard.discoveryTime')],
              type: 'line',
              formatter: millis.compact
            }}
            y2={{
              min: 0,
              metrics: ['discovery.count'],
              labels: [t('in-forge:plugins.instanaAgent.dashboard.discoveryCount')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.sensors')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sensors.time'],
              labels: [t('in-forge:plugins.instanaAgent.dashboard.senseTime')],
              type: 'line',
              formatter: millis.compact
            }}
            y2={{
              min: 0,
              metrics: ['sensors.count'],
              labels: [t('in-forge:plugins.instanaAgent.dashboard.sensorCount')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        {isInternalVisible && (
          <Fragment>
            <SensorList snapshot={snapshot} />
            <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.sensorSchedulerWorkload')}>
              <ChartExplanation>
                {t(
                  'in-forge:plugins.instanaAgent.dashboard.thePercentageOfAvailableTimeConsumedByAllOperationsRunByTheSensorsSchedulerDuringTheGivenTimePeriod'
                )}
              </ChartExplanation>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['sensors.scheduler.consumed'],
                  labels: [t('in-forge:plugins.instanaAgent.dashboard.timeConsumed')],
                  type: 'line',
                  formatter: percentage
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
            <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.slowSensors2')}>
              <ChartExplanation>
                {t(
                  'in-forge:plugins.instanaAgent.dashboard.theSensorCountTakingLongerForAnOperationThanExpectedSeeTheSensorTimingsListForDetailedInformation'
                )}
              </ChartExplanation>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['sensors.scheduler.slow'],
                  labels: [t('in-forge:plugins.instanaAgent.dashboard.slowSensors')],
                  type: 'bar',
                  aggregation: 'sum',
                  minPixelsPerBlock: 5,
                  colors: [theme.lib.colors.failure],
                  formatter: number.compact
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
            <SensorTimingList snapshot={snapshot} />
            <LogMetrics snapshot={snapshot} timeConfig={timeConfig} />
            <BundleList snapshot={snapshot} />

            <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.tracerStringBuilderPools')}>
              <ChartExplanation>
                {t(
                  'in-forge:plugins.instanaAgent.dashboard.theJavaAndPhpTracerUsePooledStringBuilderInstancesToProcessIncomingSpans'
                )}
              </ChartExplanation>
              <Columize>
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    metrics: ['java.sbc', 'java.sbr', 'php.sbc', 'php.sbr'],
                    labels: [
                      t('in-forge:plugins.instanaAgent.dashboard.createdJava'),
                      t('in-forge:plugins.instanaAgent.dashboard.releasedJava'),
                      t('in-forge:plugins.instanaAgent.dashboard.createdPhp'),
                      t('in-forge:plugins.instanaAgent.dashboard.releasedPhp')
                    ],
                    type: 'line',
                    formatter: number.compact
                  }}
                  renderPostChartContent={PluginDashboardsMarkerLanes}
                />
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    metrics: ['java.sbmuc', 'java.sbmc', 'java.sbtc', 'php.sbmuc', 'php.sbmc', 'php.sbtc'],
                    labels: [
                      t('in-forge:plugins.instanaAgent.dashboard.maxUsedCapacityJava'),
                      t('in-forge:plugins.instanaAgent.dashboard.maxCapacityJava'),
                      t('in-forge:plugins.instanaAgent.dashboard.totalCapacityJava'),
                      t('in-forge:plugins.instanaAgent.dashboard.maxUsedCapacityPhp'),
                      t('in-forge:plugins.instanaAgent.dashboard.maxCapacityPhp'),
                      t('in-forge:plugins.instanaAgent.dashboard.totalCapacityPhp')
                    ],
                    type: 'line',
                    formatter: bytesZeroDecimalPlaces
                  }}
                  renderPostChartContent={PluginDashboardsMarkerLanes}
                />
              </Columize>
            </DashboardSection>

            <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.spans')}>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['spans.opened', 'spans.closed', 'spans.filtered', 'spans.dropped'],
                  labels: [
                    t('in-forge:plugins.instanaAgent.dashboard.opened'),
                    t('in-forge:plugins.instanaAgent.dashboard.closed'),
                    t('in-forge:plugins.instanaAgent.dashboard.filtered'),
                    t('in-forge:plugins.instanaAgent.dashboard.dropped')
                  ],
                  type: 'line',
                  formatter: number.compact
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
            <SpanMetrics snapshot={snapshot} timeConfig={timeConfig} />
          </Fragment>
        )}

        {role.canConfigureAgents ? (
          <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.logOutput')}>
            <LogStreamer snapshot={snapshot} />
          </DashboardSection>
        ) : null}
      </Fragment>
    );
  }
);
