import React from 'react';

import ThreadDumpButton from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/ThreadDumpButton';
import MemoryPoolsTable from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/MemoryPoolsTable';
import JmxMetricsTable from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/JmxMetricsTable';
import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { bytes, time, twoDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import { getLabel, getCodeView } from 'in-sdk/snapshot';
import MetricValue from 'in-components/MetricValue';
import Button from 'in-components/Button';
import Chart from 'in-components/Chart';

import './Content.less';

export default function JVMDashboard({ snapshot, timeConfig }) {
  const collectors = snapshot.getIn(['data', 'jvm.collectors']);
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiHeading>{getLabel(snapshot)}</KpiHeading>
        <KpiKeyValue label="Memory Used">
          <MetricValue snapshotId={snapshotId} metric="memory.used" formatter={bytes.detailed} />
        </KpiKeyValue>

        {__DEV__ ? (
          <Button onClick={() => getSource(snapshot)} kind="secondary">
            Get source for arbitrary class
          </Button>
        ) : null}
      </KpiSection>

      <DashboardSection title="Threads">
        <ThreadDumpButton className="in-jvm-dashboard-thread-dump-button" snapshot={snapshot} />

        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['threads.new', 'threads.runnable', 'threads.timed-waiting', 'threads.waiting', 'threads.blocked'],
            labels: ['New', 'Runnable', 'Timed-Waiting', 'Waiting', 'Blocked'],
            type: 'stackedArea',
            formatter: twoDecimalPlaces
          }}
        />
      </DashboardSection>

      <DashboardSection title="Memory">
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            max: snapshot.getIn(['data', 'memory.max']),
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailedWithRaw,
            metrics: ['memory.used'],
            labels: ['Used'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <MemoryPoolsTable snapshot={snapshot} timeConfig={timeConfig} />

      {collectors ? (
        <DashboardSection title="Garbage Collection">
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: collectors.map(name => 'gc.' + name + '.time').toArray(),
              labels: collectors.map(name => name + ' Time').toArray(),
              type: 'line',
              formatter: time
            }}
            y2={{
              metrics: collectors.map(name => 'gc.' + name + '.inv').toArray(),
              labels: collectors.map(name => name + ' Invocations').toArray(),
              type: 'point',
              formatter: twoDecimalPlaces
            }}
          />
        </DashboardSection>
      ) : null}

      <JmxMetricsTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}

function getSource(snapshot) {
  const classname = prompt('Please provide the fully qualified class name');
  if (!classname) {
    return;
  }
  setActiveDialog(getCodeView(snapshot, classname));
}
