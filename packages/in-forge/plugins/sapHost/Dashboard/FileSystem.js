/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Card } from '@instana/components';

import { getUnitFormatter } from 'in-forge/plugins/sapHost/Dashboard/UnitFormatter.js';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-forge:plugins.sapHost.eventNames'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fileSystemMetric.get('eventNames');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHost.rating'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fileSystemMetric.get('rating');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHost.typeId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.fileSystemMetric.get('typeId');
      }
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'metrics.Exceptions')
    };
  },
  function FileSystem({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const fileSystemMetrics = data.get('raw_payload', []);
    const rows = fileSystemMetrics
      .keySeq()
      .toArray()
      .map(key => {
        const fileSystemMetric = fileSystemMetrics.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          fileSystemMetric
        };
      });

    const getDetails = row => {
      if (!snapshotMap?.timeConfig) {
        return;
      }
      return (
        <Card title={t('in-forge:plugins.sapHost.fileSystem')} useMaxAvailableHeight>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              metrics: ['metrics.Exceptions.' + row.key + '.value'],
              labels: [t('in-forge:plugins.sapHost.value')],
              formatter: getUnitFormatter(row.fileSystemMetric.get('unit')),
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Card>
      );
    };
    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.sapHost.fileSystem')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    );
  }
);
