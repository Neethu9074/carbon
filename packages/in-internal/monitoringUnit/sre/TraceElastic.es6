import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';
import Table from 'in-sdk/components/dashboard/Table';
import { getElasticWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import { compareIgnoreCase } from 'in-services/util/string';
import { timeConfig$ } from 'in-stores/time/config';
import { number } from 'in-services/formatters/number';
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
    traceEsNodes: getElasticWithContext('entity.host.name:"trace-elastic-*"')
  },
  function Overview({ traceEsNodes, timeConfig }) {
    if (traceEsNodes.length === 0) {
      return <LoadingIndicator type="dark" />;
    }

    traceEsNodes = sort(traceEsNodes);
    const traceEsNodeLabels = getLabels(traceEsNodes, /^(trace-elastic-\d+).*$/i);

    return (
      <div>
        <h2>Trace Elastic ({traceEsNodes.length} nodes)</h2>

        <DashboardSection title={`# of queries`}>
          <Chart
            snapshotIds={traceEsNodes.map(r => r.elastic.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.perSecond.compact,
              metrics: traceEsNodes.map(() => `indices.query_count`),
              labels: traceEsNodeLabels,
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Added documents`}>
          <Chart
            snapshotIds={traceEsNodes.map(r => r.elastic.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.perSecond.compact,
              metrics: traceEsNodes.map(() => `indices.index_count`),
              labels: traceEsNodeLabels,
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`CPU load`}>
          <Chart
            snapshotIds={traceEsNodes.map(r => r.host.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.detailed,
              tooltipFormatter: number.detailed,
              metrics: traceEsNodes.map(() => 'load.1min'),
              labels: traceEsNodeLabels,
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`CPU Usage`}>
          <Table cols={hostTableCols} rows={traceEsNodes} getRowDetails={getHostDetails} maxItemsPerPage={15} />
        </DashboardSection>

        <DashboardSection title="Data mounts">
          <Table
            cols={volumeTableCols}
            rows={getDataMountRows(traceEsNodes, timeConfig)}
            getRowDetails={getFsDetails}
            maxItemsPerPage={15}
          />
        </DashboardSection>
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
