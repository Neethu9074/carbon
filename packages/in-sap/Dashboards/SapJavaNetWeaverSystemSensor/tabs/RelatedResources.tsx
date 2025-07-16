/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
// @ts-expect-error Module needs to be translated to TS
import InfrastructureMetricSparkChart from 'in-components/SparkChart/InfrastructureMetricSparkChart';
// @ts-expect-error Module needs to be translated to TS
import { GetSpecificDashboard } from 'in-sap/Dashboards/tables/getDashboardSpecifics';
// @ts-expect-error Module needs to be translated to TS
import { colorFormatter } from 'in-sap/Dashboards/tables/ColorFormatter';
// @ts-expect-error Module needs to be translated to TS
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
// @ts-expect-error Module needs to be translated to TS
import Badge from 'in-components/tables/ServerTable/components/Badge';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import getRelatedResources from 'in-sap/subscriptions/getRelatedResources';
import { number, percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

const pathSegment = '/abapsystem';
const matrixPrefix = 'abapsystemssensor.';

let systemSnapshotId = '';

interface RelatedResourcesProps {
  hostId: string;
  timeConfig: any;
}

interface Item {
  id: string;
  overallRating: string;
  entityHealthInfo: {
    openIssues: { length: number };
    maxSeverity: string;
  };
}

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-sap:name'),
    getContent(item: Item) {
      return <GetSpecificDashboard value={item} matrixPrefix={matrixPrefix} systemSnapshotId={systemSnapshotId} />;
    }
  },
  {
    id: 'status',
    label: t('in-sap:dashboards.status'),
    getContent(item: Item) {
      return <Badge color={colorFormatter(item.overallRating)}>{item.overallRating}</Badge>;
    }
  },
  {
    id: 'cpu',
    label: t('in-sap:dashboards.cpuUsage'),
    getContent(item: Item, { timeConfig }: { timeConfig: any }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.detailed}
          metric="customMetrics.kpi.cpuUsage"
        />
      );
    }
  },
  {
    id: 'memory',
    label: t('in-sap:dashboards.memoryUsage'),
    getContent(item: Item, { timeConfig }: { timeConfig: any }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={percentage.detailed}
          metric="customMetrics.kpi.memoryUsage"
        />
      );
    }
  },
  {
    id: 'user',
    label: t('in-sap:dashboards.userLogins'),
    getContent(item: Item, { timeConfig }: { timeConfig: any }) {
      return (
        <InfrastructureMetricSparkChart
          snapshotId={item.id}
          timeConfig={timeConfig}
          formatter={number.compact}
          metric="customMetrics.session.loggedInUsers"
        />
      );
    }
  },
  {
    id: 'issues',
    label: t('in-sap:issues'),
    getContent(item: Item, { timeConfig }: { timeConfig: any }) {
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

export default function RelatedResources(props: RelatedResourcesProps) {
  systemSnapshotId = props.hostId;
  return <ServerTableWithUrlState get={getTableData} timeConfig={props.timeConfig} hostId={systemSnapshotId} />;
}

interface GetTableDataParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: string;
  timeConfig: any;
  hostId: string;
}

function getTableData({
  page = 1,
  pageSize = 20,
  orderBy = 'label',
  orderDirection = 'ASC',
  timeConfig,
  hostId
}: GetTableDataParams) {
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
