import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { bytes, timeByMicroTwoDecimalPlaces, time, twoDecimalPlaces } from 'in-services/formatters/number';
import MicrometerMetrics from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/MicrometerMetrics';
import ThreadDumpButton from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/ThreadDumpButton';
import MemoryPoolsTable from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/MemoryPoolsTable';
import JmxMetricsTable from 'in-forge/plugins/jvmRuntimePlatform/Dashboard/JmxMetricsTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import CustomMetricsV2 from 'in-sdk/components/dashboard/CustomMetricsV2';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import MetricValue from 'in-components/MetricValue';
import { getCodeView } from 'in-sdk/snapshot';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  isInternalVisible: isInternalVisible$
})(function JVMDashboard({ snapshot, timeConfig, isInternalVisible }) {
  const collectors = snapshot.getIn(['data', 'jvm.collectors']);
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Memory Used">
          <MetricValue snapshotId={snapshotId} metric="memory.used" formatter={bytes.detailed} />
        </KpiKeyValue>

        {isInternalVisible && (
          <Button onClick={() => getSource(snapshot)} kind="secondary">
            Get source for arbitrary class
          </Button>
        )}
      </KpiSection>

      <DashboardSection
        title="Threads"
        button={<ThreadDumpButton className="in-jvm-dashboard-thread-dump-button" snapshot={snapshot} />}
      >
        <ChartExplanation>
          The number of threads is quite static in most apps and usually most of them will be in <code>runnable</code>,
          which means potentially executing code, or in <code>waiting</code> or <code>timed-waiting</code>, which
          usually is some kind of network read.
        </ChartExplanation>

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

      <DashboardSection title="Heap Memory">
        <ChartExplanation>
          The total used heap memory usage will usually go up until a garbage collection makes memory available to the
          JVM again.
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
            labels: ['Used'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <MemoryPoolsTable snapshot={snapshot} timeConfig={timeConfig} />

      {collectors ? (
        <DashboardSection title="Garbage Collection">
          <ChartExplanation>
            Garbage collectors will report their activation and runtime after they have finished. Depending on the
            collector, some, if not most, of its activity will be concurrent to the application execution.
          </ChartExplanation>
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

      <DashboardSection title="Suspension">
        <ChartExplanation>
          Suspension is an indication of how much application execution might have been delayed by the JVM, OS or CPU
          during the last second. This is predominantly caused by GC activations.
        </ChartExplanation>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['suspension.time'],
            labels: ['Suspension'],
            type: 'line',
            formatter: timeByMicroTwoDecimalPlaces
          }}
        />
      </DashboardSection>

      <JmxMetricsTable snapshot={snapshot} timeConfig={timeConfig} />

      <CustomMetricsV2 snapshot={snapshot} timeConfig={timeConfig} titlePrefix="Dropwizard" />
      <MicrometerMetrics snapshot={snapshot} timeConfig={timeConfig} titlePrefix="Micrometer" />
    </div>
  );
});

function getSource(snapshot) {
  const classname = prompt('Please provide the fully qualified class name');
  if (!classname) {
    return;
  }
  setActiveDialog(getCodeView(snapshot, classname));
}
