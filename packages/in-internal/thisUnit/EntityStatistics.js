/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import InternalViewWrapper from 'in-internal/components/InternalViewWrapper';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { plugins, ID_OF_PROCESSING_STATISTICS } from 'in-forge/constants';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { getPluginName } from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-internal:monitoringUnit.thisUnit.entityStatistics.plugin'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return getPluginName(row.plugin, 1);
      }
    }
  },
  {
    title: t('in-internal:monitoringUnit.thisUnit.entityStatistics.count'),
    type: 'metric',
    typeArgs: {
      getSnapshotId() {
        return ID_OF_PROCESSING_STATISTICS;
      },
      getMetricName(row) {
        return `plugin.${row.plugin}`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  {
    timeConfig: timeConfig$
  },
  function Cockpit({ timeConfig }) {
    const rows = Object.keys(plugins).map(key => ({ key: plugins[key], plugin: plugins[key], timeConfig }));

    return (
      <InternalViewWrapper>
        <h1>{t('in-internal:thisUnit.entityStatistics.cockpit')}</h1>

        <DashboardSection title={t('in-internal:monitoringUnit.thisUnit.entityStatistics.entityCount')}>
          <Chart
            snapshotId={ID_OF_PROCESSING_STATISTICS}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`physicalEntities`],
              labels: [t('in-internal:monitoringUnit.thisUnit.entityStatistics.countOverTime')],
              type: 'line'
            }}
          />
        </DashboardSection>

        <Table
          cardTitle={t('in-internal:monitoringUnit.thisUnit.entityStatistics.perPluginEntityCount')}
          cols={cols}
          rows={rows}
          getRowDetails={getRowDetails}
          maxItemsPerPage={20}
          initialSortColumn={1}
          initialSortDirection="desc"
        />
      </InternalViewWrapper>
    );
  }
);

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={ID_OF_PROCESSING_STATISTICS}
      timeConfig={row.timeConfig}
      y1={{
        formatter: number.compact,
        metrics: [`plugin.${row.plugin}`],
        labels: [t('in-internal:monitoringUnit.thisUnit.entityStatistics.countOverTime')],
        type: 'line'
      }}
    />
  );
}
