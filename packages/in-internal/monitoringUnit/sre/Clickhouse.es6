import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import Columize from 'in-sdk/components/dashboard/Columize';
import { getClickhouseWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
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
    chNodes: getClickhouseWithContext('entity.host.name:"clickhouse-*"')
  },
  function Overview({ chNodes, timeConfig }) {
    if (chNodes.length === 0) {
      return <LoadingIndicator type="dark" />;
    }

    chNodes = sort(chNodes);
    const chNodeLabels = getLabels(chNodes, /^(clickhouse-\d+).*$/i);

    return (
      <div>
        <Columize>
          <DashboardSection title={`CPU load`}>
            <Chart
              snapshotIds={chNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.detailed,
                tooltipFormatter: number.detailed,
                metrics: chNodes.map(() => 'load.1min'),
                labels: chNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`# Query threads`}>
            <Chart
              snapshotIds={chNodes.map(r => r.clickhouse.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: chNodes.map(() => `QueryThread`),
                labels: chNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={`CPU Usage`}>
            <Table cols={hostTableCols} rows={chNodes} getRowDetails={getHostDetails} maxItemsPerPage={15} />
          </DashboardSection>

          <DashboardSection title="Data mounts">
            <Table
              cols={volumeTableCols}
              rows={getDataMountRows(chNodes, timeConfig)}
              getRowDetails={getFsDetails}
              maxItemsPerPage={15}
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
