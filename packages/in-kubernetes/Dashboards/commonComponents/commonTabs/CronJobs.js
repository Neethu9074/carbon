import React from 'react';

import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import { clusterIdUrlParameter, namespaceIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import HealthIndicatorPresenter from 'in-new-components/health/HealthIndicatorPresenter';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getKubernetesCronJobs from 'in-subscription/kubernetes/getKubernetesCronJobs';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { MINIMUM_ROLLUP, getRollupForTimeframe } from 'in-stores/metric/metric';
import { getCronJobDashboard } from 'in-kubernetes/navigation/paths';
import Card from 'in-new-components/Card';

const pathSegment = '/cronjobs';
const matrixPrefix = 'cronjob.';

const columnDefinitions = [
  {
    id: 'name',
    label: 'Name',
    getContent(item) {
      return (
        <SeverityAwareEntityLink
          label={item.cronJob.name}
          href$={getCronJobDashboard(item.cronJob.id)}
          severity={item.entityHealthInfo.maxSeverity}
        />
      );
    }
  },
  {
    id: 'schedule',
    label: 'Schedule',
    getContent(item) {
      return item.cronJob.schedule;
    }
  },
  {
    id: 'lastScheduled',
    label: 'Last Scheduled',
    getContent(item) {
      return item.cronJob.lastScheduled;
    }
  },
  {
    id: 'concurrencyPolicy',
    label: 'Concurrency Policy',
    getContent(item) {
      return item.cronJob.concurrencyPolicy;
    }
  },
  {
    id: 'health',
    label: 'Health',
    getContent(item, { timeConfig }) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.cronJob.id}
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'cronjobs'
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterIdUrlParameter, namespaceIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'cronJobName',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function CronJobs(props) {
  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="cronjobs" />
      <Card>
        <ServerTableWithUrlState get={getTableData} {...props} />
      </Card>
    </>
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'type',
  orderDirection = 'ASC',
  timeConfig,
  clusterId,
  namespaceId,
  cronJobId
}) {
  return getKubernetesCronJobs({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      label: query,
      clusterId,
      namespaceId,
      cronJobId,
      timeConfig
    },
    granularity: getRollupForTimeframe(timeConfig).rollup || MINIMUM_ROLLUP
  });
}
