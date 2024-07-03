/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import { getSpecificDashboard } from 'in-sap/Dashboards/tables/getDashboardSpecifics';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { percentage, number, percentagePlain } from 'in-services/formatters/number';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getRelatedResources from 'in-sap/subscriptions/getRelatedResources';
import { getOverallStatus } from 'in-sap/Dashboards/tables/OverallStatus';
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
import Badge from 'in-components/tables/ServerTable/components/Badge';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

const pathSegment = '/abapsystem';
const matrixPrefix = 'abapsystemssensor.';
var systemSnapshotId = '';

const workProcessObj = [
  {
    key: 'DIA',
    metrics: ['workloadcounts.dialogProcessWaiting', 'workloadcounts.numberOfDialogProcess']
  },
  {
    key: 'UPD',
    metrics: ['workloadcounts.updateProcessWaiting', 'workloadcounts.numberOfUpdateProcess']
  },
  {
    key: 'BTC',
    metrics: ['workloadcounts.batchProcessWaiting', 'workloadcounts.numberOfBatchProcess']
  },
  {
    key: 'SPO',
    metrics: ['workloadcounts.spoolProcessWaiting', 'workloadcounts.numberOfSpoolProcess']
  },
  {
    key: 'UPD2',
    metrics: ['workloadcounts.update2ProcessWaiting', 'workloadcounts.numberOfUpdate2Process']
  }
];

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-sap:name'),
    getContent(item) {
      return getSpecificDashboard(item, matrixPrefix, systemSnapshotId);
    }
  },
  {
    id: 'overallRating',
    label: t('in-sap:dashboards.overallRating'),
    getContent(item) {
      return <Badge color={colorFormatter(item.overallRating)}>{getOverallStatus(item.overallRating)}</Badge>;
    }
  },
  {
    id: 'cpu',
    label: t('in-sap:dashboards.cpuUsage'),
    sortable: false,
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
    sortable: false,
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
    sortable: false,
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
      return (
        <div>
          {workProcessObj.map((resource, index) => (
            <span key={resource.key}>
              {resource.key} <MetricValue snapshotId={item.id} metric={resource.metrics[0]} />/
              <MetricValue snapshotId={item.id} metric={resource.metrics[1]} />
              {index !== 4 && ' | '}
            </span>
          ))}
        </div>
      );
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
  defaultOrderBy: 'label',
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
