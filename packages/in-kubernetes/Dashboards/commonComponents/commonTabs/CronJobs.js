/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import K8sAgentMonitoringIssueNotifications from 'in-kubernetes/Dashboards/commonComponents/K8sAgentMonitoringIssueNotifications';
import { clusterIdUrlParameter, namespaceIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import getKubernetesCronJobs from 'in-kubernetes/subscriptions/getKubernetesCronJobs';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { useCronJobDashboard } from 'in-kubernetes/navigation/paths';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { t } from 'in-i18n';

const pathSegment = '/cronjobs';
const matrixPrefix = 'cronjob.';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-kubernetes:dashboards.name'),
    getContent(item) {
      const { cronJob, entityHealthInfo } = item;
      return <CronJobLink cronJob={cronJob} entityHealthInfo={entityHealthInfo} />;
    }
  },
  {
    id: 'schedule',
    label: t('in-kubernetes:dashboards.schedule'),
    getContent(item) {
      return item.cronJob.schedule;
    }
  },
  {
    id: 'lastScheduled',
    label: t('in-kubernetes:dashboards.lastScheduled'),
    getContent(item) {
      return item.cronJob.lastScheduled;
    }
  },
  {
    id: 'concurrencyPolicy',
    label: t('in-kubernetes:dashboards.concurrencyPolicy'),
    getContent(item) {
      return item.cronJob.concurrencyPolicy;
    }
  },
  {
    id: 'health',
    label: t('in-kubernetes:dashboards.health'),
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
    title: t('in-kubernetes:dashboards.noDataAvailable.cronjobsTitle'),
    description: t('in-kubernetes:dashboards.noDataAvailable.cronjobsDescription')
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterIdUrlParameter, namespaceIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'health',
  defaultOrderDirection: 'DESC',
  pathSegment,
  matrixPrefix
});

export default function CronJobs(props) {
  return (
    <>
      <K8sAgentMonitoringIssueNotifications {...props} entityName="cronjobs" />
      <ServerTableWithUrlState get={getTableData} {...props} />
    </>
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 20,
  orderBy = 'health',
  orderDirection = 'DESC',
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
    granularity: getInfraGranularity(timeConfig)
  });
}

function CronJobLink({ cronJob, entityHealthInfo }) {
  const cronJobHref = useCronJobDashboard(cronJob.id);

  return (
    <SeverityAwareEntityLink
      label={cronJob.name}
      icon="lib_infra_kubernetesCronJob"
      href={cronJobHref}
      severity={entityHealthInfo.maxSeverity}
    />
  );
}
