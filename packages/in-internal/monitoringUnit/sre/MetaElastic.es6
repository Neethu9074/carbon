import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';
import { Row, Col } from 'in-new-components/layout/Grid';
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
    metaEsNodes: getElasticWithContext('entity.host.name:"elastic-*"')
  },
  function Overview({ metaEsNodes, timeConfig }) {
    if (metaEsNodes.length === 0) {
      return <LoadingIndicator type="dark" />;
    }

    metaEsNodes = sort(metaEsNodes);
    const metaEsNodeLabels = getLabels(metaEsNodes, /^(elastic-\d+).*$/i);

    return (
      <div>
        <h2>Meta Elastic ({metaEsNodes.length} nodes)</h2>
        <Row>
          <Col xs={6}>
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
            <DashboardSection title="Data mounts">
              <Table
                cols={volumeTableCols}
                rows={getDataMountRows(metaEsNodes, timeConfig)}
                getRowDetails={getFsDetails}
                maxItemsPerPage={15}
              />
            </DashboardSection>
          </Col>
          <Col xs={6}>
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
            <DashboardSection title={`CPU Usage`}>
              <Table cols={hostTableCols} rows={metaEsNodes} getRowDetails={getHostDetails} maxItemsPerPage={15} />
            </DashboardSection>
          </Col>
        </Row>
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
