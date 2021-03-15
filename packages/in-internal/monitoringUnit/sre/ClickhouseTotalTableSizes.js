/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';
import React from 'react';

import { getClickhouseWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { number, bytes } from 'in-services/formatters/number';
import getAgentResponse from 'in-subscription/agentResponse';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export const cols = [
  {
    title: t('in-internal:monitoringUnit.sre.clickhouseTotalTblSize.table'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.sre.clickhouseTotalTblSize.totalByteDiskClusterWide'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.total;
      },
      getContent: bytes.detailed
    }
  },
  {
    title: t('in-internal:monitoringUnit.sre.clickhouseTotalTblSize.maxByteDiskSingleNode'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.max;
      },
      getContent: bytes.detailed
    }
  },
  {
    title: t('in-internal:monitoringUnit.sre.clickhouseTotalTblSize.minByteDiskSingleNode'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.min;
      },
      getContent: bytes.detailed
    }
  },
  {
    title: t('in-internal:monitoringUnit.sre.clickhouseTotalTblSize.nodesReportingSizeForTbl'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.nodes;
      },
      getContent: number.compact
    }
  }
];

export default connectTo({
  nodes: getClickhouseWithContext('entity.host.name:"clickhouse-*"').flatMap(nodes => {
    const observables = nodes.map(node =>
      getAgentResponse({
        action: 'clickHouse.getActiveParts',
        target: node.clickhouse.get('volatileId'),
        args: {}
      }).map(agentResponse => ({
        ...node,
        agentResponse
      }))
    );
    return combineLatest(observables);
  })
})(ClickhouseTotalTableSizes);

function ClickhouseTotalTableSizes({ nodes }) {
  if (nodes.length === 0) {
    return <LoadingIndicator />;
  }

  const { successCount, errorCount, tableSizes } = aggregate(nodes);
  // eslint-disable-next-line
  console.log({ successCount, errorCount, tableSizes, nodes });

  const rows = Object.keys(tableSizes).map(tableName => ({
    key: tableName,
    ...tableSizes[tableName]
  }));

  return (
    <Table
      cardTitle={t('in-internal:monitoringUnit.sre.clickhouseTotalTblSize.clickHouseTblSizeAnalysis')}
      cols={cols}
      rows={rows}
      maxItemsPerPage={100}
      initialSortColumn={1}
      initialSortDirection="desc"
    />
  );
}

function aggregate(nodes) {
  let successCount = 0;
  let errorCount = 0;
  const tableSizes = {};

  nodes.forEach(({ agentResponse }) => {
    if (agentResponse.error) {
      errorCount++;
      return;
    }

    successCount++;
    const statistics = JSON.parse(agentResponse.data);
    statistics.data.forEach(({ database, table, bytesOnDisk }) => {
      const name = `${database}.${table}`;
      bytesOnDisk = Number(bytesOnDisk);

      if (tableSizes[name] == null) {
        tableSizes[name] = {
          min: bytesOnDisk,
          max: bytesOnDisk,
          total: bytesOnDisk,
          nodes: 1
        };
      } else {
        tableSizes[name].min = Math.min(tableSizes[name].min, bytesOnDisk);
        tableSizes[name].max = Math.max(tableSizes[name].max, bytesOnDisk);
        tableSizes[name].total += bytesOnDisk;
        tableSizes[name].nodes++;
      }
    });
  });

  return { successCount, errorCount, tableSizes };
}
