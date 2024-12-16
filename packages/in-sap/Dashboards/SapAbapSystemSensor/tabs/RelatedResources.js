/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import { GetSpecificDashboard } from 'in-sap/Dashboards/tables/getDashboardSpecifics';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { percentage, number, percentagePlain } from 'in-services/formatters/number';
import getWorkProcessStatus from 'in-sap/Dashboards/tables/WorkProcessHelper.tsx';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getRelatedResources from 'in-sap/subscriptions/getRelatedResources';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import { t } from 'in-i18n';

const pathSegment = '/abapsystem';
const matrixPrefix = 'abapsystemssensor.';
var systemSnapshotId = '';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-sap:name'),
    getContent(item) {
      return <GetSpecificDashboard value={item} matrixPrefix={matrixPrefix} systemSnapshotId={systemSnapshotId} />;
    }
  },
  {
    id: 'overallRating',
    label: t('in-sap:dashboards.status'),
    getContent(item) {
      return <Badge color={colorFormatter(item.overallRating)}>{item.overallRating}</Badge>;
    }
  },
  {
    id: 'cpu',
    label: t('in-sap:dashboards.cpuUsage'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentagePlain.compact}
          metric="cpuMetricStats.totalUtilization"
        />
      );
    }
  },
  {
    id: 'memory',
    label: t('in-sap:dashboards.memoryUsage'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.detailed}
          metric="swapmemory.usedMemory"
        />
      );
    }
  },
  {
    id: 'user',
    label: t('in-sap:dashboards.userSessions'),
    getContent(item, { timeConfig }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={number.compact}
          metric="sapMetricsStats.userSession"
        />
      );
    }
  },
  {
    id: 'workProcess',
    label: t('in-sap:dashboards.workProcess'),
    sortable: false,
    getContent(item) {
      return getWorkProcessStatus(item);
    }
  },
  {
    id: 'issues',
    label: t('in-sap:issues'),
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
  defaultOrderBy: 'issues',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function RelatedResources(props) {
  systemSnapshotId = props.hostId;
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} hostId={systemSnapshotId} />;
}

function getTableData({ page = 0, pageSize = 20, orderBy = 'label', orderDirection = 'ASC', timeConfig, hostId }) {
  return getRelatedResources({
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
