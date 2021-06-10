/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { clusterIdUrlParameter, namespaceIdUrlParameter } from 'in-kubernetes/navigation/urlParameters';
import createServerTableWithUrlState from 'in-components/tables/ServerTable/ServerTableWithUrlState';
import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import withEmptyTableState from 'in-components/tables/ServerTable/WithEmptyTableState';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import getKubernetesJobs from 'in-subscription/kubernetes/getKubernetesJobs';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getInfraGranularity } from 'in-stores/metric/metric';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { getMetricForFocusedMoment } from 'in-stores/metric';
import { formatDuration } from 'in-services/formatters/date';
import TwoValueBar from 'in-components/TwoValueBar';
import theme from 'in-themes';
import { t } from 'in-i18n';

const pathSegment = '/jobs';
const matrixPrefix = 'job.';

const columnDefinitions = [
  {
    id: 'label',
    label: t('in-kubernetes:dashboards.name'),
    getContent(item) {
      return (
        <>
          <SeverityAwareEntityLink label={item.job.label} severity={item.entityHealthInfo.maxSeverity} />
          {item?.podIds?.map(v => {
            return (
              <EntityLink
                label="pod"
                href$={getDashboardLink(v, { pathname: '/physical/dashboard' })}
                icon="lib_kubernetes_pod"
              />
            );
          })}
        </>
      );
    }
  },
  {
    id: 'status',
    label: t('in-kubernetes:dashboards.status'),
    getContent(item) {
      return item.job.status;
    }
  },
  {
    id: 'completion',
    label: t('in-kubernetes:dashboards.completion'),
    optional: true,
    sortable: false,
    getContent(item) {
      return <JobCompletion snapshotId={item.job.id} />;
    }
  },
  {
    id: 'age',
    label: t('in-kubernetes:dashboards.age'),
    getContent(item) {
      return item.job.age && formatDuration(item.job.age);
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
          snapshotId={item.job.id}
          inContentArea
        />
      );
    }
  }
];

const ServerTableWithUrlState = createServerTableWithUrlState({
  Renderer: withEmptyTableState({
    columnDefinitions,
    entityName: 'jobs'
  }),
  paginationResettingUrlParameters: [...timeConfigUrlParameters, clusterIdUrlParameter, namespaceIdUrlParameter],
  columnDefinitions,
  defaultOrderBy: 'age',
  defaultOrderDirection: 'ASC',
  pathSegment,
  matrixPrefix
});

export default function Jobs(props) {
  return <ServerTableWithUrlState cardTitle="Jobs History" get={getTableData} {...props} />;
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
  return getKubernetesJobs({
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

function JobCompletion({ snapshotId }) {
  const podsSucceeded = useObservable(
    getMetricForFocusedMoment({
      snapshotId,
      metric: 'status.succeeded'
    })
      .map(v => v[1])
      .distinct(),
    []
  );
  const podsActive = useObservable(
    getMetricForFocusedMoment({
      snapshotId,
      metric: 'status.active'
    })
      .map(v => v[1])
      .distinct(),
    []
  );
  return podsSucceeded !== undefined || podsActive !== undefined ? (
    <TwoValueBar
      v1={podsSucceeded}
      v2={podsActive}
      v1Color={theme.lib.colors.lightBlue800}
      v2Color={theme.lib.colors.N400}
      v1Label={t('in-kubernetes:succeeded')}
      v2Label={t('in-kubernetes:active')}
      fullDomain={podsSucceeded + podsActive}
      formatter={v => v}
    />
  ) : (
    valueMissingPlaceholder
  );
}
