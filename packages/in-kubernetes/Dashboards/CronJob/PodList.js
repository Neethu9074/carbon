/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import { get } from 'lodash';

import SeverityAwareEntityLink from 'in-components/tables/sharedComponents/SeverityAwareEntityLink';
import EntityHealthIndicator from 'in-components/EntityHealthIndicator/EntityHealthIndicator';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import QueryProgressIndicator from 'in-components/AnalyzeView/QueryProgressIndicator';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import getKubernetesPods from 'in-subscription/kubernetes/getKubernetesPods';
import { retrievalSize } from 'in-components/AnalyzeView/UngroupedView';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { getPodDashboard } from 'in-kubernetes/navigation/paths';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { isLoading, hasError } from 'in-services/util/result';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { formatDuration } from 'in-services/formatters/date';
import { t } from 'in-i18n';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-kubernetes:dashboards.name'),
    getContent({ pod }) {
      return (
        <SeverityAwareEntityLink
          icon="lib_kubernetes_pod"
          label={pod.label}
          href$={getPodDashboard(pod.id)}
          severity={-1}
        />
      );
    }
  },
  {
    id: 'namespace',
    width: '8rem',
    widthInAbsoluteUnit: true,
    label: t('in-kubernetes:dashboards.namespace'),
    optional: true,
    getContent({ pod }) {
      return pod.namespace;
    }
  },
  {
    id: 'status',
    width: '8rem',
    widthInAbsoluteUnit: true,
    label: t('in-kubernetes:dashboards.status'),
    optional: true,
    getContent({ pod }) {
      return <span>{get(pod, ['status', 'statusSummary'], missingValueComponent)}</span>;
    }
  },
  {
    id: 'online',
    label: 'Online Containers',
    optional: true,
    sortable: false,
    getContent(item) {
      const containerStatuses = get(item, ['pod', 'status', 'containerStatuses'], []);
      return <span>{containerStatuses.filter(c => c.ready).length}</span>;
    }
  },
  {
    id: 'desired',
    label: 'Desired Containers',
    optional: true,
    sortable: false,
    getContent(item) {
      const containerStatuses = get(item, ['pod', 'status', 'containerStatuses'], []);
      return <span>{containerStatuses.length}</span>;
    }
  },
  {
    id: 'restartCount',
    width: '5rem',
    widthInAbsoluteUnit: true,
    label: t('in-kubernetes:dashboards.restarts'),
    optional: true,
    sortable: true,
    getContent({ pod }) {
      return <span>{get(pod, ['status', 'restarts'], missingValueComponent)}</span>;
    }
  },
  {
    id: 'age',
    width: '5rem',
    widthInAbsoluteUnit: true,
    label: t('in-kubernetes:dashboards.age'),
    optional: true,
    getContent({ pod }) {
      return pod.age && formatDuration(pod.age);
    }
  },
  {
    id: 'health',
    width: '5rem',
    widthInAbsoluteUnit: true,
    label: t('in-kubernetes:dashboards.health'),
    getContent(item, { timeConfig }) {
      return (
        <EntityHealthIndicator
          openIssues={item.entityHealthInfo.openIssues.length}
          maxSeverity={item.entityHealthInfo.maxSeverity}
          IndicatorPresenter={HealthIndicatorPresenter}
          timeConfig={timeConfig}
          snapshotId={item.pod.id}
          inContentArea
        />
      );
    }
  }
];

const missingValueComponent = (
  <CenterAlignmentColumn>
    <span>{valueMissingPlaceholder}</span>
  </CenterAlignmentColumn>
);

export default function Pods(props) {
  const { timeConfig, jobId } = props;
  const [orderBy, setOrderBy] = useState('age');
  const [orderDirection, setOrderDirection] = useState('DESC');
  function onOrderByChange({ by, direction }) {
    setOrderBy(by);
    setOrderDirection(direction);
  }

  const podsResult = useCursorPagination(
    ({ cursor }) =>
      getTableData({
        timeConfig,
        page: cursor,
        pageSize: 10,
        workloadOwnerId: jobId,
        orderBy,
        orderDirection
      }),
    [timeConfig, orderBy, orderDirection]
  );
  const loading = isLoading(podsResult);
  const hasErrors = hasError(podsResult);
  const items = podsResult.items;
  const isInitialLoading = isLoading(podsResult) && podsResult.items?.length === 0;

  // There are two loading related boolean variables here: isLoading and isInitialLoading.
  // where as isInitialLoading is only True when data is loaded for the first time
  // isLoading is true when data is loaded for the first time and when MORE data is loading
  // Here CursorPaginatedTable is returned if there is previously loaded data
  // otherwise LoadingIndicator component is returned

  if (isInitialLoading) {
    return <LoadingIndicator text={t('in-applications:loadingData')} height={100} />;
  } else if (hasErrors) {
    return <ErroneousResultPresenter errors={podsResult.errors} />;
  }
  let numberOfSkeletonRows = items.length || 3;

  return items?.length > 0 || loading === true || (loading === false && items?.length === 0) ? (
    <CursorPaginatedTable
      {...props}
      items={items}
      loadMore={podsResult.loadMore}
      canLoadMore={podsResult.canLoadMore}
      columnDefinitions={columnDefinitions}
      numSkeletonRows={numberOfSkeletonRows}
      loadMoreLabel={t('in-components:analyze.loadMoreWithCount', { count: retrievalSize })}
      onChange={({ orderBy, orderDirection }) =>
        onOrderByChange({
          by: orderBy,
          direction: orderDirection
        })
      }
      orderBy={orderBy}
      orderDirection={orderDirection}
      renderNoDataAvailable={noDataMessage => <NoDataAvailable text={noDataMessage} height={80} />}
      fixedLayout
    />
  ) : (
    <QueryProgressIndicator progress={{ ...podsResult.progress, loading }} errors={podsResult.errors} items={items} />
  );
}

function getTableData({
  query = '',
  page = 1,
  pageSize = 10,
  orderBy = 'age',
  orderDirection = 'ASC',
  timeConfig,
  namespaceId,
  clusterId,
  serviceId,
  workloadControllerId,
  workloadOwnerId,
  nodeId,
  cronJobId,
  phase
}) {
  return getKubernetesPods({
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
      namespaceId,
      workloadControllerId,
      workloadOwnerId,
      clusterId,
      serviceId,
      nodeId,
      cronJobId,
      timeConfig,
      phase
    },
    granularity: getInfraGranularity(timeConfig)
  });
}
