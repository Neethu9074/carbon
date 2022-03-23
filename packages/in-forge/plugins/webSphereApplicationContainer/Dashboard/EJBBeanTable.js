/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { millis, zeroDecimalPlaces } from 'in-services/formatters/number';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleResponseTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `ejbBeans.${row.ejbBeanKey}.responseTime`;
      },
      getContent: millis.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.webSphereAppContainer.titleResponseCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `ejbBeans.${row.ejbBeanKey}.responseCount`;
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function EJBBeanTable({ ejbContext, snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'ejbBeans', ejbContext], emptyList)
    .toArray()
    .map(key => {
      return {
        key,
        ejbBeanKey: `${ejbContext}.${key}`,
        ejbContext,
        snapshotId,
        timeConfig
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.webSphereAppContainer.titleEJBBeansCount', {
        ejbContext: ejbContext,
        len: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          formatter: millis.compact,
          metrics: ['ejbBeans.' + row.ejbBeanKey + '.responseTime'],
          labels: [t('in-forge:plugins.webSphereAppContainer.labelResponseTime')],
          type: 'line'
        }}
        y2={{
          formatter: zeroDecimalPlaces,
          metrics: ['ejbBeans.' + row.ejbBeanKey + '.responseCount'],
          labels: [t('in-forge:plugins.webSphereAppContainer.lableResponseCount')],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
