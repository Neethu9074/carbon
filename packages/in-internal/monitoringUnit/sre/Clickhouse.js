/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import {
  hostTableCols,
  volumeTableCols,
  getDataMountRows,
  getHostDetails,
  getFsDetails
} from 'in-internal/monitoringUnit/sre/datastores';
import { getClickhouseWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { number, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$,
    chNodes: getClickhouseWithContext('entity.host.name:"clickhouse-*"')
  },
  function Overview({ chNodes, timeConfig }) {
    if (chNodes.length === 0) {
      return <LoadingIndicator />;
    }

    chNodes = sort(chNodes);
    const chNodeLabels = getLabels(chNodes, /^(clickhouse-\d+).*$/i);

    return (
      <div>
        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.clickhouse.cpuLoad')}>
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

          <DashboardSection title={t('in-internal:monitoringUnit.sre.clickhouse.numQueryThreads')}>
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
          <DashboardSection title={t('in-internal:monitoringUnit.sre.clickhouse.networkDataReceive')}>
            <Chart
              snapshotIds={chNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: chNodes.map(() => `ifs.eth0.rx.bytes`),
                labels: chNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.sre.clickhouse.networkDataTransmit')}>
            <Chart
              snapshotIds={chNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: chNodes.map(() => `ifs.eth0.tx.bytes`),
                labels: chNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={t('in-internal:monitoringUnit.sre.clickhouse.cpuUsage')}>
            <Table cols={hostTableCols} rows={chNodes} getRowDetails={getHostDetails} maxItemsPerPage={15} />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.sre.clickhouse.dataMount')}>
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
