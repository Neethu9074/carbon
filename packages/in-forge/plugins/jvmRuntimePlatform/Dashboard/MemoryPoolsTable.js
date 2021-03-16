/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import TableExplanation from 'in-sdk/components/dashboard/TableExplanation';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { bytes } from 'in-services/formatters/number';
import { getMaxValue } from 'in-sdk/metrics';
import { t, Trans } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.jvmRuntimePlatform.pool'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.jvmRuntimePlatform.initial'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.pool.get('initial');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.jvmRuntimePlatform.maximum'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.pool.get('max');
      },
      getContent: formatMax
    }
  },
  {
    title: t('in-forge:plugins.jvmRuntimePlatform.value'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pools.${row.name}`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function MemoryPoolsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'jvm.pools'], emptyMap)
    .map((pool, name) => {
      return {
        key: name,
        name,
        pool,
        snapshot,
        snapshotId,
        timeConfig
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  const explanation = (
    <TableExplanation>
      <Trans i18nKey="in-forge:plugins.jvmRuntimePlatform.notAllMemoryPoolsAreConsideredToBePartOfTheJvmHeap" />
    </TableExplanation>
  );

  return (
    <Table
      cardTitle={t('in-forge:plugins.jvmRuntimePlatform.memoryPools')}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      explanation={explanation}
    />
  );
}

function formatMax(bytes) {
  return bytes === -1 ? t('in-forge:plugins.jvmRuntimePlatform.unlimited') : bytesTwoDecimalPlaces(bytes);
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        max: getMaxValue('pools.' + row.name, row.snapshot),
        formatter: bytes.detailed,
        tooltipFormatter: bytes.detailedWithRaw,
        metrics: ['pools.' + row.name],
        labels: [t('in-forge:plugins.jvmRuntimePlatform.nameUsage', { name: row.name })],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
