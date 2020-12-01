import React from 'react';

import GetMetricStatisticsInUse from 'in-forge/plugins/awsDynamoDb/GetMetricStatisticsInUse';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { millis, number } from 'in-services/formatters/number';

export default function AwsLambdaVersionDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  let noAwsAgentData = null;
  const name = snapshot.getIn(['data', 'name']);
  // An arbitrary attribute that is always present when an AWS agent monitors this Lambda but never provided by an
  // in-process collector.
  const codeSha = snapshot.getIn(['data', 'code_sha_256']);
  if (name == null || codeSha == null) {
    noAwsAgentData = (
      <DashboardNotification type="danger">
        It seems you are not monitoring this Lambda with an Instana agent. Setting up an AWS agent for the corresponding
        AWS account is a pre-requisite for native Lambda tracing. Please check our documentation on that, in particular
        the <a href="https://instana.com/docs/ecosystem/aws#installation">AWS agent installation docs</a>.
      </DashboardNotification>
    );
  }

  return (
    <>
      {noAwsAgentData}
      <GetMetricStatisticsInUse snapshot={snapshot} />
      <DashboardSection title="Invocations">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['invocations'],
            labels: ['Invocations'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Durations">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['duration', 'duration_maximum', 'duration_minimum'],
            labels: ['Average', 'Maximum', 'Minimum'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['duration_sum'],
            labels: ['Sum'],
            type: 'line',
            formatter: millis.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Errors">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['errors'],
            labels: ['Errors'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Throttles">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['throttles'],
            labels: ['Throttles'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Dead Letter Errors">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['dead_letter_error'],
            labels: ['Dead Letter Errors'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Iterator Age">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['iterator_age', 'iterator_age_maximum', 'iterator_age_minimum'],
            labels: ['Average', 'Maximum', 'Minimum'],
            type: 'line',
            formatter: millis.detailed
          }}
          y2={{
            min: 0,
            metrics: ['iterator_age_sum'],
            labels: ['Sum'],
            type: 'line',
            formatter: millis.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Concurrent Executions">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['concurrent_executions', 'concurrent_executions_maximum', 'concurrent_executions_minimum'],
            labels: ['Average', 'Maximum', 'Minimum'],
            type: 'line',
            formatter: number.compact
          }}
          y2={{
            min: 0,
            metrics: ['concurrent_executions_sum'],
            labels: ['Sum'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title="Unreserved Concurrent Executions">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['unreserved_concurrent_executions'],
            labels: ['Unreserved Concurrent Executions'],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </>
  );
}
