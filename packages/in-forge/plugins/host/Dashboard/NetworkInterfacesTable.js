/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  percentageZeroDecimalPlaces,
  percentageTwoDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  bytesPerSecondZeroDecimalPlaces
} from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { emptyMap, emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.host.dashboard.interface'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.name;
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.mac'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.iface.get('mac');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.iPs'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.iface
          .get('addresses', emptyList)
          .map(address => address.get('ip'))
          .join(', ');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.rxBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `ifs.${row.name}.rx.bytes`;
      },
      getContent: bytesPerSecondZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.rxErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `ifs.${row.name}.rx.errors`;
      },
      getContent: percentageZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.txBytes'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `ifs.${row.name}.tx.bytes`;
      },
      getContent: bytesPerSecondZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.txErrors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `ifs.${row.name}.tx.errors`;
      },
      getContent: percentageZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function NetworkInterfacesTable({ snapshot, timeConfig }) {
  const rows = snapshot
    .getIn(['data', 'interfaces'], emptyMap)
    .map((iface, name) => {
      return {
        key: name,
        name,
        iface,
        snapshotId: snapshot.get('id'),
        timeConfig
      };
    })
    .valueSeq()
    .toArray();

  return (
    <Table
      cardTitle={t('in-forge:plugins.host.dashboard.networkInterfaces')}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
    />
  );
}

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: bytesZeroDecimalPlaces,
        tooltipFormatter: bytesTwoDecimalPlaces,
        metrics: ['ifs.' + row.name + '.rx.bytes', 'ifs.' + row.name + '.tx.bytes'],
        labels: [t('in-forge:plugins.host.dashboard.receivedS'), t('in-forge:plugins.host.dashboard.transmittedS')],
        type: 'line'
      }}
      y2={{
        min: 0,
        max: 1,
        metrics: ['ifs.' + row.name + '.rx.errors', 'ifs.' + row.name + '.tx.errors'],
        labels: [t('in-forge:plugins.host.dashboard.rxErrors'), t('in-forge:plugins.host.dashboard.txErrors')],
        formatter: percentageZeroDecimalPlaces,
        tooltipFormatter: percentageTwoDecimalPlaces,
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
