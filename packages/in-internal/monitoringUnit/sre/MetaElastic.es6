import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import Columize from 'in-sdk/components/dashboard/Columize';
import Chart from 'in-components/Chart';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import Table from 'in-sdk/components/dashboard/Table';
import { getPhysicalStack } from 'in-internal/components/dataRetrieval';
import { getElasticWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import { compareIgnoreCase } from 'in-services/util/string';
import { timeConfig$ } from 'in-stores/time/config';
import { number, timeByMicroTwoDecimalPlaces } from 'in-services/formatters/number';
import {
  hostTableCols,
  volumeTableCols,
  getDataMountRows,
  getHostDetails,
  getFsDetails
} from 'in-internal/monitoringUnit/sre/datastores';

export default connectTo(
  {
    timeConfig: timeConfig$,
    metaEsNodes: getElasticWithContext('entity.host.name:"elastic-*"'),
    jvmNodes: timeConfig$.flatMap(timeConfig =>
      getPhysicalStack({
        searchQuery: 'entity.host.name:"elastic-*"',
        timeConfig,
        restrictResultEntityType: 'jvmRuntimePlatform'
      })
    )
  },
  function Overview({ metaEsNodes, jvmNodes, timeConfig }) {
    if (!metaEsNodes || !jvmNodes) {
      return <LoadingIndicator type="dark" />;
    }

    if (metaEsNodes.length < 1) {
      return <div>Statistics provider not found.</div>;
    }
    if (jvmNodes.length < 1) {
      return <div>Statistics provider not found.</div>;
    }

    metaEsNodes = sort(metaEsNodes);
    const metaEsNodeLabels = getLabels(metaEsNodes, /^(elastic-\d+).*$/i);

    return (
      <div>
        <h2>Meta Elastic ({metaEsNodes.length} nodes)</h2>
        <Columize>
          <DashboardSection title={`# of queries`}>
            <Chart
              snapshotIds={metaEsNodes.map(r => r.elastic.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: metaEsNodes.map(() => `indices.query_count`),
                labels: metaEsNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
          <DashboardSection title={`Added documents`}>
            <Chart
              snapshotIds={metaEsNodes.map(r => r.elastic.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: metaEsNodes.map(() => `indices.index_count`),
                labels: metaEsNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={`CPU load`}>
            <Chart
              snapshotIds={metaEsNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.detailed,
                tooltipFormatter: number.detailed,
                metrics: metaEsNodes.map(() => 'load.1min'),
                labels: metaEsNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title="Suspension">
            <ChartExplanation>
              Suspension is an indication of how much application execution might have been delayed by the JVM, OS or
              CPU during the last second. This is predominantly caused by GC activations.
            </ChartExplanation>
            <Chart
              snapshotIds={jvmNodes.map(r => r.jvmRuntimePlatform.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: timeByMicroTwoDecimalPlaces,
                metrics: jvmNodes.map(() => 'suspension.time'),
                labels: metaEsNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title="Data mounts">
            <Table
              cols={volumeTableCols}
              rows={getDataMountRows(metaEsNodes, timeConfig)}
              getRowDetails={getFsDetails}
              maxItemsPerPage={15}
            />
          </DashboardSection>
          <DashboardSection title={`CPU Usage`}>
            <Table cols={hostTableCols} rows={metaEsNodes} getRowDetails={getHostDetails} maxItemsPerPage={15} />
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
