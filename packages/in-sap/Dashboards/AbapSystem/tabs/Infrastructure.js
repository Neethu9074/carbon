/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import getRelatedInfrastructureResourcesForAbapSystem from 'in-sap/subscriptions/getRelatedInfrastructureResourcesForAbapSystem';
import { kiloBytesZeroDecimalPlaces, percentagePlainZeroDecimalPlaces } from 'in-services/formatters/number';
import PhysicalDashboardEntityLink from 'in-components/tables/sharedComponents/PhysicalDashboardEntityLink';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { t } from 'in-i18n';

const pathSegment = '/abapsystem';
const matrixPrefix = 'abapsystems.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-sap:dashboards.name'),
    sortable: false,
    getContent: (item, { timeConfig }) => <PhysicalDashboardEntityLink item={item} timeConfig={timeConfig} />
  },
  {
    id: 'cpuUsage',
    label: t('in-sap:dashboards.cpuUsage'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentagePlainZeroDecimalPlaces}
          metric="metrics.Performance.CPU_SYSTEM_UTILIZATION.value"
        />
      );
    }
  },
  {
    id: 'memoryUsage',
    label: t('in-sap:dashboards.memoryUsage'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={kiloBytesZeroDecimalPlaces}
          metric="metrics.Performance.MEMORY_TOTAL_KB.value"
        />
      );
    }
  },
  {
    id: 'health',
    label: t('in-sap:health'),
    getContent(item, { timeConfig }) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.id}
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  paginationResettingUrlParameters: [...timeConfigUrlParameters],
  columnDefinitions,
  defaultOrderBy: 'label',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function RelatedResources(props) {
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} hostId={props.hostId} />;
}

function getTableData({ page = 1, pageSize = 20, orderBy = 'label', orderDirection = 'ASC', timeConfig, hostId }) {
  return getRelatedInfrastructureResourcesForAbapSystem({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      hostId,
      timeConfig
    }
  });
}
