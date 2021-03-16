/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getPluginName } from 'in-sdk/pluginName';
import { plugins } from 'in-forge/constants';
import search from 'in-subscription/search';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-internal:monitoringUnit.unit.entityStatistics.plugin'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return getPluginName(row.plugin, 1);
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.unit.entityStatistics.count'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return row.plugin;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  ({ tenant, unit }) => ({
    timeConfig: timeConfig$,
    snapshotId: timeConfig$.flatMap(timeConfig =>
      search({
        query: `entity.selfType:entityStatistics AND selfMonitoring.tenant:"${tenant}" AND selfMonitoring.unit:"${unit}"`,
        view: 'TABLE',
        timeConfig,
        restrictResultEntityType: 'entityStatistics'
      })
        .startWith(null)
        .map(snapshotsIds => snapshotsIds && snapshotsIds.first())
    )
  }),
  function Cockpit({ timeConfig, snapshotId }) {
    if (!snapshotId) {
      return <LoadingIndicator />;
    }
    const rows = Object.keys(plugins).map(key => ({ key: plugins[key], plugin: plugins[key], timeConfig, snapshotId }));

    return (
      <Fragment>
        <DashboardSection title={t('in-internal:monitoringUnit.unit.entityStatistics.entityCount')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`total`],
              labels: [t('in-internal:monitoringUnit.unit.entityStatistics.countOverTime')],
              type: 'line'
            }}
          />
        </DashboardSection>

        <Table
          cardTitle={t('in-internal:monitoringUnit.unit.entityStatistics.perPluginEntityCount')}
          cols={cols}
          rows={rows}
          getRowDetails={getRowDetails}
          maxItemsPerPage={20}
          initialSortColumn={1}
          initialSortDirection="desc"
        />
      </Fragment>
    );
  }
);

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: number.compact,
        metrics: [row.plugin],
        labels: [t('in-internal:monitoringUnit.unit.entityStatistics.countOverTime')],
        type: 'line'
      }}
    />
  );
}
