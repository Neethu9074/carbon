/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import theme from 'in-themes';

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

export default connectTo(
  {
    isInternalVisible: isInternalVisible$
  },
  function InstanaAgentDashboard({ snapshot, timeConfig, isInternalVisible }) {
    const snapshotId = snapshot.get('id');
    return (
      <Fragment>
        <DashboardSection title="Management">
          <ManagementButtonSection snapshot={snapshot} />
        </DashboardSection>
        <Columize>
          <DashboardSection title="Info">
            <InfoButtonSection snapshot={snapshot} />
          </DashboardSection>
          <DashboardSection
            title="Configuration Management"
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
            <DashboardSection title="CPU Load">
              <Chart
                snapshotId={snapshot.get('id')}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['cpu.load'],
                  labels: ['Load'],
                  type: 'stackedArea',
                  formatter: number.detailed
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
          ) : null}
          <DashboardSection title="Memory">
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                max: snapshot.getIn(['data', 'memory.total']),
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: ['memory.used'],
                labels: ['Heap'],
                type: 'line'
              }}
              y2={{
                min: 0,
                max: snapshot.getIn(['data', 'memory.nativeTotal']),
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: ['memory.nativeUsed', 'memory.nonHeapUsed'],
                labels: ['Direct Buffers', 'Off Heap'],
                type: 'line'
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
        <DashboardSection title="Garbage Collection">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: time,
              metrics: ['gc.Copy.time', 'gc.MarkSweepCompact.time'],
              labels: ['Copy Time', 'MarkSweepCompact Time'],
              type: 'line'
            }}
            y2={{
              formatter: twoDecimalPlaces,
              metrics: ['gc.Copy.count', 'gc.MarkSweepCompact.count'],
              labels: ['Copy Invocation', 'MarkSweepCompact Invocation'],
              type: 'point'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Network">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesPerSecondZeroDecimalPlaces,
              tooltipFormatter: bytesPerSecondTwoDecimalPlaces,
              metrics: ['net.rx', 'net.tx'],
              labels: ['Received', 'Sent'],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Discovery">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['discovery.time'],
              labels: ['Discovery time'],
              type: 'line',
              formatter: millis.compact
            }}
            y2={{
              min: 0,
              metrics: ['discovery.count'],
              labels: ['Discovery Count'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title="Sensors">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['sensors.time'],
              labels: ['Sense time'],
              type: 'line',
              formatter: millis.compact
            }}
            y2={{
              min: 0,
              metrics: ['sensors.count'],
              labels: ['Sensor Count'],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        {isInternalVisible && (
          <Fragment>
            <SensorList snapshot={snapshot} />
            <DashboardSection title="Sensor Scheduler Workload">
              <ChartExplanation>
                The percentage of available time consumed by all operations run by the sensors scheduler during the
                given time period.
              </ChartExplanation>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['sensors.scheduler.consumed'],
                  labels: ['Time Consumed'],
                  type: 'line',
                  formatter: percentage
                }}
                renderPostChartContent={PluginDashboardsMarkerLanes}
              />
            </DashboardSection>
            <DashboardSection title="Slow Sensors">
              <ChartExplanation>
                The sensor count taking longer for an operation than expected. See the sensor timings list for detailed
                information.
              </ChartExplanation>
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['sensors.scheduler.slow'],
                  labels: ['Slow sensors'],
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

            <DashboardSection title="Tracer StringBuilder Pools">
              <ChartExplanation>
                The Java and PHP Tracer use pooled StringBuilder instances to process incoming spans. If the created and
                released metrics are not zero the pools are full. StringBuilder instances are created (and released) on
                demand then. Also StringBuilder instances which grew over 8 MB are not pooled, but immediately released.
                Both scenarios might lead to increased heap usage and GC pressure.
              </ChartExplanation>
              <Columize>
                <Chart
                  snapshotId={snapshotId}
                  timeConfig={timeConfig}
                  y1={{
                    min: 0,
                    metrics: ['java.sbc', 'java.sbr', 'php.sbc', 'php.sbr'],
                    labels: ['Created (Java)', 'Released (Java)', 'Created (PHP)', 'Released (PHP)'],
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
                      'Max Used Capacity (Java)',
                      'Max Capacity (Java)',
                      'Total Capacity (Java)',
                      'Max Used Capacity (PHP)',
                      'Max Capacity (PHP)',
                      'Total Capacity (PHP)'
                    ],
                    type: 'line',
                    formatter: bytesZeroDecimalPlaces
                  }}
                  renderPostChartContent={PluginDashboardsMarkerLanes}
                />
              </Columize>
            </DashboardSection>

            <DashboardSection title="Spans">
              <Chart
                snapshotId={snapshotId}
                timeConfig={timeConfig}
                y1={{
                  min: 0,
                  metrics: ['spans.opened', 'spans.closed', 'spans.filtered', 'spans.dropped'],
                  labels: ['Opened', 'Closed', 'Filtered', 'Dropped'],
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
          <DashboardSection title="Log Output">
            <LogStreamer snapshot={snapshot} />
          </DashboardSection>
        ) : null}
      </Fragment>
    );
  }
);
