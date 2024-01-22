/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

/* eslint-disable import/no-deprecated */
import React, { Fragment } from 'react';

import {
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces,
  bytesPerSecondTwoDecimalPlaces,
  percentageZeroDecimalPlaces,
  millis,
  number,
  percentage,
  twoDecimalPlaces,
  time,
  siPrefix
} from 'in-services/formatters/number';
import ConfigurationManagementDialog from 'in-forge/plugins/instanaAgent/Dashboard/ConfigurationManagementDialog';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ManagementButtonSection from 'in-forge/plugins/instanaAgent/Dashboard/ManagementButtonSection';
import ConfigurationManagement from 'in-forge/plugins/instanaAgent/Dashboard/ConfigurationManagement';
import SupportSection from 'in-forge/plugins/instanaAgent/Dashboard/SupportButtonSection';
import InfoButtonSection from 'in-forge/plugins/instanaAgent/Dashboard/InfoButtonSection';
import SensorTimingList from 'in-forge/plugins/instanaAgent/Dashboard/SensorTimingList';
import AgentLogStreamer from 'in-forge/plugins/instanaAgent/Dashboard/AgentLogStreamer';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import SpanMetrics from 'in-forge/plugins/instanaAgent/Dashboard/SpanMetrics';
import ImageButton from 'in-forge/plugins/instanaAgent/Dashboard/ImageButton';
import BundleList from 'in-forge/plugins/instanaAgent/Dashboard/BundleList';
import LogMetrics from 'in-forge/plugins/instanaAgent/Dashboard/LogMetrics';
import SensorList from 'in-forge/plugins/instanaAgent/Dashboard/SensorList';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import IssueList from 'in-forge/plugins/instanaAgent/Dashboard/IssueList';
import { agentMonitoringIssuesEnabled } from 'in-services/featureFlags';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { supportsOpenFiles } from 'in-forge/plugins/host/hostUtils';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import Columize from 'in-sdk/components/dashboard/Columize';
import { carbonAlert } from 'in-themes/chartColors';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default connectTo(
  ({ snapshot }) => ({
    isInternalVisible: isInternalVisible$,
    hostSnapshot: getHostSnapshotId(snapshot).flatMap(getSnapshot)
  }),
  function InstanaAgentDashboard({ snapshot, timeConfig, isInternalVisible, hostSnapshot }) {
    const snapshotId = snapshot.get('id');
    const metricIds = snapshot.get('metricIds');
    const collectors = metricIds
      .filter(metric => metric.startsWith('gc') && metric.endsWith('count'))
      .map(metric => metric.substring(3, metric.length - 6))
      .toArray();
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
                  {snapshot.getIn(['data', 'git', 'initialized'])
                    ? t('in-forge:plugins.instanaAgent.dashboard.buttonUpdate')
                    : t('in-forge:plugins.instanaAgent.dashboard.buttonInitialize')}
                </ImageButton>
              ) : null
            }
          >
            <ConfigurationManagement snapshot={snapshot} />
          </DashboardSection>
        </Columize>
        {(role.canConfigureAgents || isInternalVisible) && (
          <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.support')}>
            <SupportSection snapshot={snapshot} />
          </DashboardSection>
        )}
        {(agentMonitoringIssuesEnabled || isInternalVisible) && (
          <IssueList snapshot={snapshot} timeConfig={timeConfig} />
        )}
        <Columize>
          {snapshot.getIn(['data', 'hasCpuLoad']) && snapshot.getIn(['data', 'hasProcessData']) ? (
            <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.cpuLoad')}>
              <ChartExplanation>
                {t(
                  'in-forge:plugins.instanaAgent.dashboard.userAndSystemShowLoadInPercentWhere100EqualASingleCoreAtFullLoad'
                ) +
                  ' ' +
                  t(
                    'in-forge:plugins.instanaAgent.dashboard.LoadIsComputedInTheJVMRelatedToTheCombinedProcessingPowerAndNormalizedTo1'
                  )}
              </ChartExplanation>
              <Chart
                snapshotId={snapshot.get('id')}
                timeConfig={timeConfig}
                y2={{
                  min: 0,
                  metrics: ['cpu.load'],
                  labels: [t('in-forge:plugins.instanaAgent.dashboard.load')],
                  formatter: number.detailed,
                  type: 'line'
                }}
                y1={{
                  metrics: ['proc.cpu.user', 'proc.cpu.sys'],
                  labels: [
                    t('in-forge:plugins.process.dashboard.user'),
                    t('in-forge:plugins.process.dashboard.system')
                  ],
                  type: 'stackedArea',
                  formatter: percentageZeroDecimalPlaces
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
          ) : snapshot.getIn(['data', 'hasProcessData']) ? (
            <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.cpuLoad')}>
              <ChartExplanation>
                {t(
                  'in-forge:plugins.instanaAgent.dashboard.userAndSystemShowLoadInPercentWhere100EqualASingleCoreAtFullLoad'
                )}
              </ChartExplanation>
              <Chart
                snapshotId={snapshot.get('id')}
                timeConfig={timeConfig}
                y1={{
                  metrics: ['proc.cpu.user', 'proc.cpu.sys'],
                  labels: [
                    t('in-forge:plugins.process.dashboard.user'),
                    t('in-forge:plugins.process.dashboard.system')
                  ],
                  type: 'stackedArea',
                  formatter: percentageZeroDecimalPlaces
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
          ) : snapshot.getIn(['data', 'hasCpuLoad']) ? (
            <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.cpuLoad')}>
              <ChartExplanation>
                {t(
                  'in-forge:plugins.instanaAgent.dashboard.LoadIsComputedInTheJVMRelatedToTheCombinedProcessingPowerAndNormalizedTo1'
                )}
              </ChartExplanation>
              <Chart
                snapshotId={snapshot.get('id')}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['cpu.load'],
                  labels: [t('in-forge:plugins.instanaAgent.dashboard.load')],
                  formatter: number.detailed,
                  type: 'line'
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
        {snapshot.getIn(['data', 'hasProcessData']) ? (
          <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.systemMemory')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesTwoDecimalPlaces,
                metrics: ['proc.mem.virtual', 'proc.mem.resident', 'proc.mem.share'],
                labels: [
                  t('in-forge:plugins.process.dashboard.virtual'),
                  t('in-forge:plugins.process.dashboard.resident'),
                  t('in-forge:plugins.process.dashboard.share')
                ],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        ) : null}
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
                metrics: collectors.map(name => 'gc.' + name + '.time'),
                labels: collectors.map(name => t('in-forge:plugins.jvmRuntimePlatform.nameTime', { name: name })),
                type: 'line',
                aggregation: 'sum',
                formatter: time
              }}
              y2={{
                metrics: collectors.map(name => 'gc.' + name + '.count'),
                labels: collectors.map(name =>
                  t('in-forge:plugins.jvmRuntimePlatform.nameInvocations', { name: name })
                ),
                type: 'point',
                aggregation: 'sum',
                formatter: twoDecimalPlaces
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        ) : null}
        {snapshot.getIn(['data', 'hasProcessData']) && hostSnapshot && supportsOpenFiles(hostSnapshot) && (
          <DashboardSection title={t('in-forge:plugins.process.dashboard.openFiles')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: siPrefix.compact,
                tooltipFormatter: number.compact,
                metrics: ['proc.openFiles.current'],
                labels: [t('in-forge:plugins.process.dashboard.current')],
                type: 'line'
              }}
              y2={{
                min: 0,
                max: 1,
                metrics: ['proc.openFiles.used'],
                labels: [t('in-forge:plugins.process.dashboard.used')],
                formatter: percentageZeroDecimalPlaces,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        )}
        {snapshot.getIn(['data', 'proc.ctx_switches_enabled']) ? (
          <DashboardSection title={t('in-forge:plugins.process.dashboard.numberOfContextSwitches')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: ['proc.ctx_switches.voluntary', 'proc.ctx_switches.nonvoluntary'],
                labels: [
                  t('in-forge:plugins.process.dashboard.voluntary'),
                  t('in-forge:plugins.process.dashboard.nonvoluntary')
                ],
                formatter: number.compact,
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        ) : null}
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
                minPixelsPerBlock={5}
                y1={{
                  min: 0,
                  metrics: ['sensors.scheduler.slow'],
                  labels: [t('in-forge:plugins.instanaAgent.dashboard.slowSensors')],
                  type: 'bar',
                  aggregation: 'sum',
                  colors: [carbonAlert.red60],
                  formatter: number.compact
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
            <SensorTimingList snapshot={snapshot} />
            <DashboardSection title={t('in-forge:plugins.instanaAgent.dashboard.AgentPoolStats')}>
              <Columize>
                <>
                  <h3>Runtime</h3>
                  <Chart
                    snapshotId={snapshotId}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      metrics: [
                        'sensors.scheduler.poolStats.scheduler.runtime',
                        'sensors.scheduler.poolStats.executor.runtime',
                        'sensors.scheduler.poolStats.agent-http.runtime',
                        'sensors.scheduler.poolStats.agent-socket.runtime'
                      ],
                      labels: [
                        t('in-forge:plugins.instanaAgent.dashboard.scheduler'),
                        t('in-forge:plugins.instanaAgent.dashboard.executor'),
                        t('in-forge:plugins.instanaAgent.dashboard.agenthttp'),
                        t('in-forge:plugins.instanaAgent.dashboard.agentsocket')
                      ],
                      type: 'line',
                      formatter: time
                    }}
                    renderPostChartContent={PluginDashboardsMarkerLanes}
                  />
                </>
                <>
                  <h3>ActiveCount</h3>
                  <Chart
                    snapshotId={snapshotId}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      metrics: [
                        'sensors.scheduler.poolStats.scheduler.activeCount',
                        'sensors.scheduler.poolStats.executor.activeCount'
                      ],
                      labels: [
                        t('in-forge:plugins.instanaAgent.dashboard.scheduler'),
                        t('in-forge:plugins.instanaAgent.dashboard.executor')
                      ],
                      type: 'line',
                      formatter: number.compact
                    }}
                    renderPostChartContent={PluginDashboardsMarkerLanes}
                  />
                </>
              </Columize>
              <Columize>
                <>
                  <h3>QueueSize</h3>
                  <Chart
                    snapshotId={snapshotId}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      metrics: [
                        'sensors.scheduler.poolStats.scheduler.queueSize',
                        'sensors.scheduler.poolStats.executor.queueSize'
                      ],
                      labels: [
                        t('in-forge:plugins.instanaAgent.dashboard.scheduler'),
                        t('in-forge:plugins.instanaAgent.dashboard.executor')
                      ],
                      type: 'line',
                      formatter: number.compact
                    }}
                    renderPostChartContent={PluginDashboardsMarkerLanes}
                  />
                </>
                <>
                  <h3>PoolSize</h3>
                  <Chart
                    snapshotId={snapshotId}
                    timeConfig={timeConfig}
                    y1={{
                      min: 0,
                      metrics: [
                        'sensors.scheduler.poolStats.scheduler.poolSize',
                        'sensors.scheduler.poolStats.executor.poolSize'
                      ],
                      labels: [
                        t('in-forge:plugins.instanaAgent.dashboard.scheduler'),
                        t('in-forge:plugins.instanaAgent.dashboard.executor')
                      ],
                      type: 'line',
                      formatter: number.compact
                    }}
                    renderPostChartContent={PluginDashboardsMarkerLanes}
                  />
                </>
              </Columize>
            </DashboardSection>
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
            <AgentLogStreamer snapshot={snapshot} />
          </DashboardSection>
        ) : null}
      </Fragment>
    );
  }
);
