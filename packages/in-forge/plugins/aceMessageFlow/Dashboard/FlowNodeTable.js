/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { micros, number, timeByMicroTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const missingValue = 'N/A';

const nodeNameCol = {
  title: t('in-forge:plugins.aceMessageFlow.flowNodeName'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.key;
    }
  }
};
const nodeTypeCol = {
  title: t('in-forge:plugins.aceMessageFlow.nodeType'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.flowNode.get('type');
    }
  }
};
const nodeMaxElapsedTime_Col = {
  title: t('in-forge:plugins.aceFlowNode.maxElapsedTime'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return 'flowNodes.' + row.key + '.maxElapsedTime';
    },
    getContent: function(maxElapsedTime) {
      if (maxElapsedTime < 0) {
        return missingValue;
      } else {
        return timeByMicroTwoDecimalPlaces(maxElapsedTime);
      }
    },
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

export default function FlowNodeTable({ snapshot, snapshotId, timeConfig }) {
  const rows = snapshot
    .getIn(['data', 'flowNodes'], emptyMap)
    .map((flowNode, name) => {
      return {
        key: name,
        flowNode,
        timeConfig,
        snapshotId
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  const cols = [nodeNameCol, nodeTypeCol, nodeMaxElapsedTime_Col];

  return (
    <Table
      cardTitle={t('in-forge:plugins.aceMessageFlow.flowNodeNumber', { count: rows.length })}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      initialSortDirection="asc"
      initialSortColumn={cols.indexOf(nodeNameCol)}
    />
  );
}

function getDetails(row) {
  return (
    <>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: micros.compact,
            tooltipFormatter: micros.compact,
            metrics: [
              'flowNodes.' + row.key + '.totalCpuTime',
              'flowNodes.' + row.key + '.maxCpuTime',
              'flowNodes.' + row.key + '.minCpuTime'
            ],
            labels: [
              t('in-forge:plugins.aceFlowNode.totalCpuTime'),
              t('in-forge:plugins.aceFlowNode.maxCpuTime'),
              t('in-forge:plugins.aceFlowNode.minCpuTime')
            ],
            type: 'line'
          }}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: micros.compact,
            tooltipFormatter: micros.compact,
            metrics: [
              'flowNodes.' + row.key + '.totalElapsedTime',
              'flowNodes.' + row.key + '.maxElapsedTime',
              'flowNodes.' + row.key + '.minElapsedTime'
            ],
            labels: [
              t('in-forge:plugins.aceFlowNode.totalElapsedTime'),
              t('in-forge:plugins.aceFlowNode.maxElapsedTime'),
              t('in-forge:plugins.aceFlowNode.minElapsedTime')
            ],
            type: 'line'
          }}
        />
      </Columize>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: ['flowNodes.' + row.key + '.invocations'],
            labels: [t('in-forge:plugins.aceFlowNode.invocations')],
            type: 'line'
          }}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: number.compact,
            tooltipFormatter: number.compact,
            metrics: ['flowNodes.' + row.key + '.inputTerminals', 'flowNodes.' + row.key + '.outputTerminals'],
            labels: [
              t('in-forge:plugins.aceFlowNode.inputTerminals'),
              t('in-forge:plugins.aceFlowNode.outputTerminals')
            ],
            type: 'line'
          }}
        />
      </Columize>
    </>
  );
}
