import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getCassandraWithContext } from 'in-internal/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import { number } from 'in-services/formatters/number';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';
export default connectTo(
  {
    timeConfig: timeConfig$,
    metricsNodes: getCassandraWithContext('entity.host.name:"cassandra-*"'),
    spansNodes: getCassandraWithContext('entity.host.name:"spans-cassandra-*"')
  },
  function Overview({ metricsNodes, spansNodes, timeConfig }) {
    if (metricsNodes.length === 0 || spansNodes.length === 0) {
      return <LoadingIndicator type="dark" />;
    }

    metricsNodes = sort(metricsNodes);
    const metricsNodeLabels = getLabels(metricsNodes, /^cassandra-(\d+).*$/i);
    spansNodes = sort(spansNodes);
    const spansNodeLabels = getLabels(spansNodes, /^spans-cassandra-(\d+).*$/i);

    return (
      <div>
        <h1>Metrics Cassandra</h1>

        <Columize>
          <DashboardSection title={`Writes`}>
            <Chart
              snapshotIds={metricsNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: metricsNodes.map(() => `clientrequests.write.count`),
                labels: metricsNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Reads`}>
            <Chart
              snapshotIds={metricsNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: metricsNodes.map(() => `clientrequests.read.count`),
                labels: metricsNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title="Pending Compactions">
            <Chart
              snapshotIds={metricsNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                metrics: metricsNodes.map(() => `compaction.pending`),
                labels: metricsNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`CPU load`}>
            <Chart
              snapshotIds={metricsNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.detailed,
                tooltipFormatter: number.detailed,
                metrics: metricsNodes.map(() => 'load.1min'),
                labels: metricsNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <h1>Spans Cassandra</h1>

        <Columize>
          <DashboardSection title={`Writes`}>
            <Chart
              snapshotIds={spansNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: spansNodes.map(() => `clientrequests.write.count`),
                labels: spansNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Reads`}>
            <Chart
              snapshotIds={spansNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: spansNodes.map(() => `clientrequests.read.count`),
                labels: spansNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title="Pending Compactions">
            <Chart
              snapshotIds={spansNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                metrics: spansNodes.map(() => `compaction.pending`),
                labels: spansNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`CPU load`}>
            <Chart
              snapshotIds={spansNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.detailed,
                tooltipFormatter: number.detailed,
                metrics: spansNodes.map(() => 'load.1min'),
                labels: spansNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
);

function sort(rows) {
  return rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
}

function getLabels(rows, regexp) {
  return rows.map(r => r.host.get('label').replace(regexp, '$1'));
}
